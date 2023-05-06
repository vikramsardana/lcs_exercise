export interface Member {
    stateDistrict: string,
    memberInfo: MemberInfo
}

export interface MemberInfo {
    nameList: string,
    bioGuideID: string,
    lastName: string,
    firstName: string,
    middleName?: string,
    fullName: string,
    sortName: string,
    suffix?: string,
    courtesy: string,
    priorCongress: string,
    officialName: string,
    formalName: string,
    party: string,
    caucus: string,
    state: State,
    district: string,
    townName: string,
    officeBuilding: string,
    officeRoom: string,
    officeZip: string,
    officeZipSuffix: string,
    phone: string,
    electedDate: DateObject,
    swornDate: DateObject,
    committeeAssignments: CommitteeAssignments
}

export interface State {
    postalCode: string,
    stateFullName: string
}

export interface DateObject {
    date: string,
    text: string
}

export interface CommitteeAssignments {
    committee: Committee[],
    subcommittee: Committee[]
}

export interface Committee {
    comCode?: string,
    subcomCode?: string,
    rank: string,
    leadership?: string
}