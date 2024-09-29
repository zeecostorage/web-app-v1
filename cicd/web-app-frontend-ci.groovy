pipeline {
    agent any

    environment {
        FRONTEND_IMAGE_NAME="dockerzarif/ccsd-project-frontend"
        IMAGE_SCAN_LOG="frontend-${BUILD_ID}-scan-result.json"
    }

    stages {
        stage('Code Checkout') {
            steps {
                // Get some code from a GitHub repository
                git branch: 'main', url: 'https://github.com/ZarifRamzan/web-app-v1.git'
            }
        }

        stage('Code Dependencies') {
            steps {
                dir('frontend') {
                    sh script:"""
                    #!/bin/bash
                    nodejs -v
                    npm -v
                    npm install
                """
                }
            }
        }

        stage('Code Test') {
            steps {
                dir('backend') {
                    sh script:"""
                        #!/bin/bash
                        npm test
                    """
                }
            }
        }

        stage('Image Build') {
            steps {
                sh script:"""
                    #!/bin/bash
                    docker build -f frontend/Dockerfile -t ${FRONTEND_IMAGE_NAME}:${BUILD_ID} frontend
                """
            }
        }

       stage('Image Scan') {
            steps {
                script {
                    sh script:"""
                        #!/bin/bash
                        trivy -v
                    """
                    
                    // Run Trivy to scan the Docker image
                    def trivyOutput = sh(script: "trivy image --format json --output ${IMAGE_SCAN_LOG} ${FRONTEND_IMAGE_NAME}:${BUILD_ID}", returnStdout: true).trim()

                    // Display Trivy scan results
                    println trivyOutput

                    // Check if vulnerabilities were found
                    if (trivyOutput.contains("Total: 0")) {
                        echo "No vulnerabilities found in the Docker image."
                    } else {
                        echo "Vulnerabilities found in the Docker image."
                    }
                    
                    archiveArtifacts artifacts: "${IMAGE_SCAN_LOG}", followSymlinks: false
                    
                    sh script:"""
                        #!/bin/bash
                        rm ${IMAGE_SCAN_LOG}
                        ls -l
                    """
                }
            }
        }

        stage('Image Push') {
            environment {
                // Set DOCKERHUB credential with Id DOCKERHUB_SERVICE_ACCOUNT
                DOCKERHUB_CREDS = credentials('DOCKERHUB_SERVICE_ACCOUNT')
            }
            
            steps {
                script {
                    sh script:'''
                        echo $DOCKERHUB_CREDS_PSW | docker login --username $DOCKERHUB_CREDS_USR --password-stdin
                        docker push ${FRONTEND_IMAGE_NAME}:${BUILD_ID}
                    '''
                }

            }
        }
    }
}
