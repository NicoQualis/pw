    pipeline {
        agent any

        environment {
            // Define environment variables
            TEMP = "C:/Temp"  // Cambia el directorio temporal a uno con permisos adecuados
            TMP = "C:/Temp"
        }

        stages {
            stage('Checkout') {
                steps {
                    // Clona el repositorio
                    git url: 'https://github.com/NicoQualis/pw.git', branch: 'master'
                }
            }

            stage('Install Dependencies') {
                steps {
                    script {
                        // Instala las dependencias del proyecto
                        bat 'npm install'
                    }
                }
            }

            stage('Install Playwright Browsers') {
                steps {
                    script {
                        // Establece el directorio temporal para Playwright
                        bat 'set TEMP=C:\\Temp'
                        bat 'set TMP=C:\\Temp'
                        // Instala los navegadores necesarios para Playwright
                        bat 'npx playwright install'
                    }
                }
            }

            stage('Run Playwright Tests') {
                steps {
                    script {
                        // Ejecuta las pruebas de Playwright
                        bat 'npx playwright test'
                    }
                }
            }
        }

        post {
            always {
                // Guarda los resultados de las pruebas y registros
                archiveArtifacts artifacts: 'playwright-report/*.*', allowEmptyArchive: true
                
                // Publica el reporte HTML
                publishHTML(target: [
                    reportName: 'Playwright Report',
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: false
                ])
            }

            failure {
                // Acciones a realizar en caso de fallo
                echo 'Build failed!'
            }

            success {
                // Acciones a realizar en caso de éxito
                echo 'Build succeeded!'
            }
        }
    }
