const API_URL = 'http://localhost:5000/test/json';
export const getMembers2 = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    const memberData = [];
    for (const eachMember of data.MemberData?.members.member) {
        memberData.push(convertToMemberType(eachMember));
    }
    return memberData;
};
export function getCommitteeMembers2(memberList, code) {
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
