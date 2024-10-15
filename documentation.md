# Documentation

## Glossary

- **Item** : corresponds to a name and image (optional)
- **List** : corresponds to a set of **Items**
- **Ranking** : corresponds to a ranking of a list

## User Stories

### List Creation

- The user chooses a name
- The user writes items as **Items**
- The user saves the list

### Ranking Creation

#### List Selection

- The user chooses between created lists
- The user can choose to [create a new list](#list-creation)

#### Display Selection

- The user chooses how to display the new ranking between :
    - **Numbered** : 1,2,3...
    - **Tier List** : S,A,B,C (customizable)
    - **Pyramid** : One 1st, Two 2nd, Three 3rd, ...
    - **Points** : ?/100, ?/50, ?/10
    - **Tournament** : 1 champ, 2 finalist, 4 demi-finalist...

#### Creation Method

- The user how to create the ranking :
    - **Manual** : For each **Items** the user chooses the rank (Available for all Display)
    - **Criteria** : The user defines criterias and give a mark for each criteria (Available for **Points** and *
      *Numbered** Displays)
    - **1v1 algorithm** : The user chooses between two items that the algorithm chose to have the less matches
      possible (Available for **Numbered**, **Pyramid**)
    - **Tournament Algorithm** : idem (Not the same as 1v1, requires less matches)

> Comment : Criteria is quite manual after all ? 