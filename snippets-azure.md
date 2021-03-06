# Node.js
# Build a general Node.js project with npm.
# Add steps that analyze code, save build artifacts, deploy, and more:
# https://docs.microsoft.com/azure/devops/pipelines/languages/javascript

trigger:
  - master
  
  variables:
    COVERALLS_SERVICE_NAME: 'Azure Devops'
    COVERALLS_REPO_TOKEN: 'rTi89wSWAgRSLutOmfGTDzjTgBHrDHM4S'
    COVERALLS_SERVICE_JOB_ID: $(Build.BuildId)
    COVERALLS_GIT_BRANCH: $(Build.SourceBranchName)
  
  jobs:
    - job: "Build_and_Test"
      steps:
      - task: NodeTool@0
        displayName: 'Install node'
        inputs:
          versionSpec: '10.x'
      - script: |
          npm audit --production
        displayName: 'NPM Audit'
      - script: |
          npm install
          npm run build
        displayName: 'NPM Build'
      - script: |
          npm run test
        displayName: 'NPM Test'
      - script: |
          npm run coveralls
        displayName: 'Coveralls Report'
      - task: PublishCodeCoverageResults@1
        displayName: 'Code_coverage_report'
        inputs:
          codeCoverageTool: Cobertura
          summaryFileLocation: $(System.DefaultWorkingDirectory)/coverage/cobertura-coverage.xml
      - task: PublishTestResults@2
        displayName: 'Publish_Test_Results'
        inputs:
          testResultsFormat: 'JUnit'
          testResultsFiles: '$(System.DefaultWorkingDirectory)/junit.xml'
        # - task: WhiteSource Bolt@20
        #   inputs:
        #     cwd: '$(System.DefaultWorkingDirectory)/' 
      - task: SonarCloudPrepare@1
        inputs:
          SonarCloud: 'azure-devops-build'
          organization: 'eteration'
          scannerMode: 'CLI'
          configMode: 'manual'
          cliProjectKey: 'secure-devops-sandbox.azure-meetups.eteration'
          cliProjectName: 'secure-devops-sandbox'
          cliSources: '.'
      - task: SonarCloudAnalyze@1
      - task: SonarCloudPublish@1
        inputs:
          pollingTimeoutSec: '300'
      - task: Docker@2
        displayName: 'Build and push Docker Image'
        inputs:
          containerRegistry: 'Azure Container Registry (eteration)'
          repository: 'meetup/secure-devops-sandbox'
          command: 'buildAndPush'
          Dockerfile: 'Dockerfile'
          buildContext: '.'
          tags: |
            build$(Build.BuildId)
            devLatest
      - task: Bash@3
        displayName: 'Container vulnerability scan'
        inputs:
          targetType: 'inline'
          script: |
            export CLAIR_ADDR=52.149.59.87:6060
            export CLAIR_OUTPUT=Negligible
            export CLAIR_THRESHOLD=10
            export FORMAT_OUTPUT=standard
            export DOCKER_USER=$(DOCKER_USER)
            export DOCKER_PASSWORD=$(DOCKER_PASSWORD)
            wget -q https://github.com/optiopay/klar/releases/download/v2.4.0/klar-2.4.0-linux-amd64
            chmod +x ./klar-2.4.0-linux-amd64
            ./klar-2.4.0-linux-amd64 eteration.azurecr.io/meetup/secure-devops-sandbox:devLatest > klar-report.txt
            cat ./klar-report.txt
            status=$?  
            ## take some decision ## 
            ## Did we found IP address? Use exit status of the grep command ##
            if [ $status -eq 0 ]
            then
              echo "Success: Container vulnerability check has passed" 
              exit 0
            else
              echo "Failure: Container vulnerability check has failed" >&2
              exit 1
            fi
      - task: CopyFiles@2
        inputs:
          sourceFolder: '$(Build.SourcesDirectory)'
          contents: '**/klar-report.txt'
          targetFolder: '$(Build.ArtifactStagingDirectory)'
      - task: alcide-advisor-scan@2
        inputs:
          advisorScanReportFormat: 'html'
          advisorScanReport: '$(Build.ArtifactStagingDirectory)/advisor-report.html'
          alcideApiKey: 'c46e1d45-564c-4844-a95b-61b639426a5b'
          connectionType: 'Azure Resource Manager'
          azureSubscriptionEndpoint: 'Microsoft Azure(83f544a2-cbae-45e2-9ee7-14deb94e0a27)'
          azureResourceGroup: 'azure-meetup'
          kubernetesCluster: 'webinar'
      - task: CopyFiles@2
        inputs:
          sourceFolder: '$(Build.SourcesDirectory)'
          contents: '**/advisor-report.html'
          targetFolder: '$(Build.ArtifactStagingDirectory)'
      - task: PublishBuildArtifacts@1
        inputs:
          artifactName: 'Vulnerability'