pipeline {
  agent any

  environment {
    IMAGE_NAME = "elb1n/nodejs-app"
    IMAGE_TAG  = "${BUILD_NUMBER}"
    KUBECONFIG = credentials('kubeconfig')
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'main',
            url: 'https://github.com/elb1n/nodejs-app.git'
      }
    }

    stage('Install & Test') {
      steps {
        sh '''
          npm ci
          npm test
        '''
      }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
      }
    }

    stage('Push to Registry') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh """
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
            docker push ${IMAGE_NAME}:${IMAGE_TAG}
            docker tag  ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest
            docker push ${IMAGE_NAME}:latest
          """
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh """
          kubectl set image deployment/nodejs-app \
            nodejs-app=${IMAGE_NAME}:${IMAGE_TAG}
          kubectl rollout status deployment/nodejs-app
        """
      }
    }

  }

  post {
    success {
      echo "Pipeline succeeded!"
    }
    failure {
      echo "Pipeline failed. Check logs."
    }
  }
}
