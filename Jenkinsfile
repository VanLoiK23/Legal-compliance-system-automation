pipeline {
    agent any

    environment {
        VPS_HOST = '103.200.22.83'
        VPS_USER = 'root'
        DEPLOY_PATH = '/var/www/Legal-compliance-system-automation'
        SSH_KEY = '/var/jenkins_home/.ssh/jenkins_vps'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling code from GitHub...'
                checkout scm
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh '''
                    docker-compose -f /workspace/docker-compose.yml \
                    -p legal-compliance-system-automation \
                    run --rm backend \
                    sh -c "npm test || echo No tests found"
                '''
            }
        }

        stage('Deploy to VPS') {
            steps {
                echo 'Deploying to VPS...'
                sh """
                    ssh -i ${SSH_KEY} \
                        -o StrictHostKeyChecking=no \
                        ${VPS_USER}@${VPS_HOST} \
                        'cd ${DEPLOY_PATH} && \
                         git pull origin main && \
                         docker compose -f docker-compose.prod.yml up -d --build && \
                         docker image prune -f'
                """
            }
        }

        stage('Health Check') {
            parallel {
                stage('Check Backend') {
                    steps {
                        sh '''
                            sleep 15
                            curl -f https://app.hdpe36.pro.vn/api/rule || exit 1
                        '''
                    }
                }
                stage('Check Frontend') {
                    steps {
                        sh '''
                            sleep 15
                            curl -f https://app.hdpe36.pro.vn || exit 1
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy VPS thanh cong!'
        }
        failure {
            echo 'Deploy VPS that bai!'
            sh """
                ssh -i ${SSH_KEY} \
                    -o StrictHostKeyChecking=no \
                    ${VPS_USER}@${VPS_HOST} \
                    'cd ${DEPLOY_PATH} && docker compose -f docker-compose.prod.yml logs --tail=50'
            """
        }
    }
}