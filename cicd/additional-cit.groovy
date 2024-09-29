pipeline {
    agent any

    environment {
        BACKEND_IMAGE_NAME="sirdocker/ccsd-project-backend"
        BACKEND_DEPLOY_TAG="ABC"
    }

    stages {
        stage('Code Checkout') {
            steps {
                // Get some code from a GitHub repository
                git branch: 'main', url: 'https://github.com/ZarifRamzan/web-app-v1.git'
            }
        }

        stage('Container Deploy') {
            steps {
                // dir('compose/backend') {
                    sh script:"""
                        #!/bin/bash
                        #docker compose version
                        # for stopping
                        #docker compose -f docker-compose.yml down
                        # for creating
                        #docker compose -f docker-compose.yml up
                        docker version
                        docker run -d --name web-app-backend -p 7000:8070 ${BACKEND_IMAGE_NAME}:${BACKEND_DEPLOY_TAG}
                    """
                // }
            }
        }

        stage('Container Test') {
            steps {
                // dir('backend') {
                    sh script:"""
                        #!/bin/bash
                        docker ps
                    """
                // }
            }
        }

        /**
        stage('Container Cleanup') {
            steps {
                sh script:"""
                    #!/bin/bash
                    docker build -f backend/Dockerfile -t ${BACKEND_IMAGE_NAME}:${BUILD_ID} backend
                """
            }
        }
        **/

       stage('Tag Production') {
            steps {
                script {
                    sh script:"""
                        #!/bin/bash
                        trivy -v
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
                        docker push ${BACKEND_IMAGE_NAME}:${BUILD_ID}
                    '''
                }

            }
        }
    }
}
