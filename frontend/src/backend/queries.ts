import { gql } from "@apollo/client";

/**
 * GraphQL query to get the member information for the table. Limited to just the fields being used in the table.
 */
export const GetMemberDataForTable = gql`
query MemberQuery {
  members {
    stateDistrict
    memberInfo {
      fullName
      party
      officeBuilding
      officeRoom
    }
  }
}
`

/**
 * GraphQL query to get the member data for the graph. Limited to just the fields being used to make the graph.
 */
export const GetMemberDataForGraph = gql`
query MemberQuery {
  members {
    memberInfo {
      fullName
      committeeAssignments {
        committee {
          comCode
        }
      }
    }
  }
}
`

/**
 * GraphQL query to get all member data.
 */
export const GetIndividualMemberData = gql`
query MemberQuery ($stateDistrict: String) {
    member (stateDistrict: $stateDistrict) {
        stateDistrict
        memberInfo {
        nameList
        bioGuideID
        firstName
        lastName
        fullName
        middleName
        sortName
        officialName
        formalName
        suffix
        courtesy
        priorCongress
        party
        caucus
        state {
            postalCode
            stateFullName
        }
        district
        townName
        officeBuilding
        officeRoom
        officeZip
        officeZipSuffix
        phone
        electedDate {
            date
            text
        }
        swornDate {
            date
            text
        }
        committeeAssignments {
            committee {
            comCode
            rank
            leadership
            }
            subcommittee {
            subcomCode
            rank
            leadership
            }
        }
        }
    }
}`

