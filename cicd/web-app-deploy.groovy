pipeline {
    agent any

    parameters {
        string description: 'Targeted backend image tag to deploy.', name: 'BACKEND_TAG'
        string description: 'Targeted frontend image tag to deploy.', name: 'FRONTEND_TAG'
    }

    environment {
        BACKEND_IMAGE_NAME="sirdocker/ccsd-project-backend"
        BACKEND_TARGET_TAG="${BACKEND_TAG}"
        FRONTEND_IMAGE_NAME="sirdocker/ccsd-project-frontend"
        FRONTEND_TARGET_TAG="${FRONTEND_TAG}"

    }

    stages {
        stage('Config Checkout') {
            steps {
                // Get some code from a GitHub repository
                git branch: 'cicd-pipeline', url: 'https://github.com/ZarifRamzan/web-app-v1.git'
            }
        }

        stage('Get Current Tags') {
            environment {
                BACKEND_EXISTING_TAG=0
                FRONTEND_EXISTING_TAG=0
            }
            steps {
                script {
                    BACKEND_EXISTING_TAG=sh(script: "docker compose -p web-app ps 2> /dev/null | awk '/web-app-backend/ {print \$2}' | awk -F: '{print \$2}'", returnStdout: true).trim()
                    FRONTEND_EXISTING_TAG=sh(script: "docker compose -p web-app ps 2> /dev/null | awk '/web-app-frontend/ {print \$2}' | awk -F: '{print \$2}'", returnStdout: true).trim()

                    echo "BACKEND_EXISTING_TAG=${BACKEND_EXISTING_TAG}"
                    echo "FRONTEND_EXISTING_TAG=${FRONTEND_EXISTING_TAG}"
                }
            }
        }

        stage('Container Deployment') {
            steps {
                dir('deployment') {
                    sh script:"""
                        #!/bin/bash
                        pwd
                        ls -l
                        docker version
                        docker compose version
                        # for creating
                        docker compose -p web-app -f docker-compose.yaml up -d
                        # for stopping
                        #docker compose -f docker-compose.yaml down
                    """
                }
            }
        }

        stage('Verify Tags') {
            environment {
                BACKEND_DEPLOYED_TAG=0
                FRONTEND_DEPLOYED_TAG=0
                ROLLBACK=false
            }
            steps {
                dir('deployment') {
                    sh script:"""
                        #!/bin/bash
                        sleep 5
                        docker compose -p web-app ps
                    """
                }

                script {
                    BACKEND_DEPLOYED_TAG=sh(script: "docker compose -p web-app ps 2> /dev/null | awk '/web-app-backend/ {print \$2}' | awk -F: '{print \$2}'", returnStdout: true).trim()
                    FRONTEND_DEPLOYED_TAG=sh(script: "docker compose -p web-app ps 2> /dev/null | awk '/web-app-frontend/ {print \$2}' | awk -F: '{print \$2}'", returnStdout: true).trim()

                    if ( BACKEND_TARGET_TAG == BACKEND_DEPLOYED_TAG ) {
                        echo "Tags matched: BACKEND_TARGET_TAG=${BACKEND_TARGET_TAG} == BACKEND_DEPLOYED_TAG=${BACKEND_DEPLOYED_TAG}"
                    } else {
                        echo "Tags do not matched: BACKEND_TARGET_TAG=${BACKEND_TARGET_TAG} != BACKEND_DEPLOYED_TAG=${BACKEND_DEPLOYED_TAG}"
                        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                            error "Failing the stage because condition is false."
                        }
                    }

                    if ( FRONTEND_TARGET_TAG == FRONTEND_DEPLOYED_TAG ) {
                        echo "Tags matched: FRONTEND_TARGET_TAG=${FRONTEND_TARGET_TAG} == FRONTEND_DEPLOYED_TAG=${FRONTEND_DEPLOYED_TAG}"
                    } else {
                        echo "Tags do not matched: FRONTEND_TARGET_TAG=${FRONTEND_TARGET_TAG} != FRONTEND_DEPLOYED_TAG=${FRONTEND_DEPLOYED_TAG}"
                        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                            error "Failing the stage because condition is false."
                        }
                    }
                }
            }
            post {
                failure {
                    script {
                        ROLLBACK=true
                        echo "ROLLBACK=${ROLLBACK}"
                    }
                }
            }
        }

        stage('Container Rollback') {
            when {
                expression { 
                    //return ROLLBACK
                    //booleanParam(name: "ROLLBACK", defaultValue: true)
                    return env.ROLLBACK == "true"
                }
            }

            steps {
                script {
                    echo "BACKEND_EXISTING_TAG=${BACKEND_EXISTING_TAG}"
                    echo "FRONTEND_EXISTING_TAG=${FRONTEND_EXISTING_TAG}"
                    // TODO: Future update for rollback. Just install image with existing capture tags.
                    echo "Lets roll on"
                }
            }
        }
    }
}
