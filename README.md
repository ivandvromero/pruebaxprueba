![logo](https://github.com/moondrop-entertainment/k7-Web/blob/master/SupportImages/logo.png)

# k7-Web - Dale! 🚀

What we do every day so you can handle the money at your own pace.

Please read the [CONTRIBUTING.md](https://github.com/moondrop-entertainment/k7-Web/blob/master/CONTRIBUTING.md) for details of our code of conduct, and the process for sending us pull requests.

## Documentation Git Flow (specification Branchs) and deploy order in each environments. 📦

### GitFlow Model 🤓🛠️

![model_git_flow](https://github.com/moondrop-entertainment/k7-Web/blob/master/SupportImages/model_git_flow.png)

The `bilateral line` indicates that before making the mixture in the respective branch, our branch must be updated.

Example:

From my local branch I want to upload the changes to the development branch, before doing my push to development, I have to do development overhaul to my branch, to mitigate that I have my branch updated, and that the current changes in the development branch allow you to identify if you have conflicts in the functionalities or code worked

##

This GitFlow focused on generating a culture in all the developers and allowing the majority of those involved to know how work works with our branches, mitigate problems due to parallel developments and help us to have a discipline in what we do.
***The following image specifies how to work on each branch and how would discipline in our daily work.***

| Branch                     | Description                                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Master                     | It will be our main branch, it will be the source for stage and production.                                                             |
| Hotfix                     | It will be our branch to solve all incidents presented in production                                                                    |
| Release                    | It will be our branch dedicated to qa, it will upload all the changes made in the stable development environments                        |
| Bugfix                     | It will be our branch where the errors found in the tests in the QA environments will be adjusted                                        |
| Development                | It will be our branch where it centralizes all the changes made in the branches of each team. (Natural person, Merchant and Debit Card) |
| Development - Team         | It will be our branch by team, to centralize the changes made by each cell.                                                             |
| Feature - Team             | It will be our local branch where we will work on the new development.                                                                  |

##

> Developer Flow

***Once having the knowledge in which our work will focus, the normal flow will be as follows.***

- You must create a `local copy` of `master branch`. `A branch must be created for each functionality or each History to be developed`.
- Once the development is finished and the tests are executed `locally`, the changes must be uploaded to the `development branch of your work team` (***natural person, merchant or debit card***).
- The changes must be uploaded to the `development branch`.
- The changes must be uploaded to the `release branch`. Once mixed in QA, the testing team will be responsible for certifying that the solution meets the acceptance criteria to be mixed in staging and then production.
- If QA certifies that the acceptance criteria are met, it will be mixed with `MASTER branch`.

## In each mix you should before uploading the changes to the branch must be rebase, and avoid future conflicts.

##

> Bugfix Flow

***Once the information developed in the QA environments has been mixed, if any error is found, the following flow should be followed.***

- A local branch must be created with a copy of the branch of Release or QA, This branch will have the name of BugFix + The number of the Bug reported.
- Once the adjustments are finished, the mixture must be generated with Release or QA for its respective validation
- If when validating the functionality the incident does not replicate, it will proceed to mix in stage and later to production.

## In each mix you should before uploading the changes to the branch must be rebase, and avoid future conflicts.

##

> Hotfix Flow

***If an error is found in production, the following flow must be followed***

- If an error is found in production that must be adjusted immediately, a Master copy is created locally
- Once the development is finished, it must be mixed in QA for their respective validations
- If QA certifies that the acceptance criteria are met, it will be mixed with `MASTER branch`.

## In each mix you should before uploading the changes to the branch must be rebase, and avoid future conflicts.

##

### Environments Model 🤓🔨

![model_environments](https://github.com/moondrop-entertainment/k7-Web/blob/master/SupportImages/model_enviroments.png)

In the previous graphic, the deployment flow per mix in each branch is shown.

> Environment flow

In the development flow the deployments are made in each environments in the following way:
- The development branch for each team and the development branch will be deployed in the `development` environments
  - All the changes made in the development that want to pass a quality control, will be deployed in the `QA` environment
    - Once the tests are executed, it is deployed to the `stage` and to `production`, only the stage binaries will be copied.
