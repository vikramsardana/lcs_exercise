import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
/**
 * The GraphQL type defs, parallel to the Types file
 */
const typeDefs = `
  type Member {
    stateDistrict: String
    memberInfo: MemberInfo
  }

  type MemberInfo {
    nameList: String
    bioGuideID: String
    lastName: String
    firstName: String
    middleName: String
    fullName: String
    sortName: String
    suffix: String
    courtesy: String
    priorCongress: String
    officialName: String
    formalName: String
    party: String
    caucus: String
    state: State
    district: String
    townName: String
    officeBuilding: String
    officeRoom: String
    officeZip: String
    officeZipSuffix: String
    phone: String
    electedDate: DateObject
    swornDate: DateObject
    committeeAssignments: CommitteeAssignments
  }

  type State {
    postalCode: String
    stateFullName: String
  }

  type DateObject {
    date: String
    text: String
  }

  type CommitteeAssignments {
    committee: [Committee]
    subcommittee: [Committee]
  }

  type Committee {
    comCode: String
    subcomCode: String
    rank: String
    leadership: String
  }

  type Query {
    members: [Member]
    member(stateDistrict: String): Member
    committee(code: String): [Member]
  }
`;
const API_URL = 'http://localhost:5000/test/json';
/**
 * Fetches the member data from the JSON compiled by the dotnet api, and converts it to a member type
 * @returns memberData, an array of Member objects
 */
const getMembers = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    const memberData = [];
    for (const eachMember of data.MemberData?.members.member) {
        memberData.push(convertToMemberType(eachMember));
    }
    return memberData;
};
/**
 * Gets the members of each committee, given a committee code
 * @param memberList - a list of Member objects
 * @param code - the desired committee code
 * @returns a list of Member objects who are part of the committee
 */
function getCommitteeMembers(memberList, code) {
    const committeeMembers = [];
    for (const eachMember of memberList) {
        for (const eachCommittee of eachMember.memberInfo.committeeAssignments.committee) {
            if (eachCommittee.comCode === code) {
                committeeMembers.push(eachMember);
                break;
            }
        }
    }
    if (committeeMembers.length > 0) {
        return committeeMembers;
    }
    for (const eachMember of memberList) {
        for (const eachSubcommittee of eachMember.memberInfo.committeeAssignments.subcommittee) {
            if (eachSubcommittee.subcomCode === code) {
                committeeMembers.push(eachMember);
                break;
            }
        }
    }
    return committeeMembers;
}
/**
 * Takes a JSON blob from the original JSON file and converts it to our custom Member type
 * @param data - a JSON element from the input data
 * @returns a Member object with the formatted data
 */
function convertToMemberType(data) {
    const committees = [];
    const subcommittees = [];
    if (Array.isArray(data['committee-assignments']['committee'])) {
        for (const eachCommittee of data['committee-assignments']['committee']) {
            let committeeInfo = {
                comCode: eachCommittee['@comcode'],
                rank: eachCommittee['@rank'],
                leadership: eachCommittee['@leadership'],
            };
            committees.push(committeeInfo);
        }
    }
    else {
        let committeeInfo = {
            comCode: data['committee-assignments']['committee']['@comcode'],
            rank: data['committee-assignments']['committee']['@rank'],
            leadership: data['committee-assignments']['committee']['@leadership']
        };
        committees.push(committeeInfo);
    }
    if (Array.isArray(data['committee-assignments']['subcommittee'])) {
        for (const eachCommittee of data['committee-assignments']['subcommittee']) {
            let committeeInfo = {
                subcomCode: eachCommittee['@subcomcode'],
                rank: eachCommittee['@rank'],
                leadership: eachCommittee['@leadership']
            };
            subcommittees.push(committeeInfo);
        }
    }
    return {
        stateDistrict: data.statedistrict,
        memberInfo: {
            nameList: data['member-info'].namelist,
            bioGuideID: data['member-info'].bioguideID,
            lastName: data['member-info'].lastname,
            firstName: data['member-info'].firstname,
            middleName: data['member-info'].middleName,
            fullName: data['member-info'].firstname + ' ' + data['member-info'].lastname,
            sortName: data['member-info']['sort-name'],
            suffix: data['member-info'].suffix,
            courtesy: data['member-info'].courtesy,
            priorCongress: data['member-info']['prior-congress'],
            officialName: data['member-info']['official-name'],
            formalName: data['member-info']['formal-name'],
            party: data['member-info'].party,
            caucus: data['member-info'].caucus,
            state: {
                postalCode: data['member-info']['state']['postal-code'],
                stateFullName: data['member-info']['state']['state-fullname']
            },
            district: data['member-info'].district,
            townName: data['member-info'].townname,
            officeBuilding: data['member-info']['office-building'],
            officeRoom: data['member-info']['office-room'],
            officeZip: data['member-info']['office-zip'],
            officeZipSuffix: data['member-info']['office-zip-suffix'],
            phone: data['member-info'].phone,
            electedDate: {
                date: data['member-info']['elected-date']['@date'],
                text: data['member-info']['elected-date']['#text']
            },
            swornDate: {
                date: data['member-info']['sworn-date']['@date'],
                text: data['member-info']['sworn-date']['#text']
            },
            committeeAssignments: {
                committee: committees,
                subcommittee: subcommittees
            }
        }
    };
}
const resolvers = {
    Query: {
        members: async () => {
            let result = await getMembers();
            return result || [];
        },
        member: async (parent, args, contextValue, info) => {
            let result = await getMembers();
            return result.find((member) => member.stateDistrict === args.stateDistrict);
        },
        committee: async (parent, args, contextValue, info) => {
            let result = await getMembers();
            return getCommitteeMembers(result, args.code);
        },
    },
};
const server = new ApolloServer({
    resolvers,
    typeDefs,
});
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`Server listening at: ${url}`);
