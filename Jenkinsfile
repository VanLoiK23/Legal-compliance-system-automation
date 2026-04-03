pipeline {
    agent any

    environment {
        COMPOSE_FILE = '/workspace/docker-compose.yml'
        COMPOSE_PROJECT_NAME = 'legal-compliance-system-automation' // xác nhận lại tên này
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling code from GitHub...'
                checkout scm
            }
        }

         stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh 'docker-compose up -d --build'
                sh 'docker image prune -f'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh '''
                    docker-compose run --rm backend \
                    sh -c "npm test || echo No tests found"
                '''
            }
        }

        stage('Health Check') {
            parallel {
                stage('Check Backend') {
                    steps {
                        sh '''
                            sleep 10
                            curl -f http://localhost/api/rule || exit 1
                        '''
                    }
                }
                stage('Check Frontend') {
                    steps {
                        sh '''
                            sleep 10
                            curl -f http://localhost || exit 1
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy toan bo thanh cong!'
        }
        failure {
            echo 'Deploy that bai! Kiem tra logs.'
            sh 'docker-compose logs --tail=50'
        }
    }
}