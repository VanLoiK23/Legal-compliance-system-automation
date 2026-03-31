pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/VanLoiK23/Legal-compliance-system-automation'
            }
        }

        // stage('Build Client') {
        //     steps {
        //         sh 'cd client && npm install && npm run build'
        //     }
        // }

        stage('Deploy với Docker Compose') {
            steps {
                sh 'docker compose down'
                sh 'docker compose build --no-cache'
                sh 'docker compose up -d'
            }
        }

        stage('Kiểm tra') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        failure {
            echo 'Deploy thất bại!'
        }
        success {
            echo 'Deploy thành công!'
        }
    }
}