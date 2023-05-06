import { Member } from '../../../backend/src/types';

/**
 * Helper function to create a map of each committee and its members
 * @param members - an array of Member objects
 * @returns a Map (key: the committee code, value: a list of names of the committee members)
 */
function buildCommitteeMemberMap(members: Member[]): Map<string, string[]> {
  const committeeMap: Map<string, string[]> = new Map<string, string[]>();
  for(const eachMember of members){
    for(const eachCommittee of eachMember.memberInfo.committeeAssignments.committee){
      if(eachCommittee.comCode){
        if(committeeMap.get(eachCommittee.comCode!)){
          let committeeMembers = committeeMap.get(eachCommittee.comCode!);
          committeeMembers!.push(eachMember.memberInfo.fullName);
          committeeMap.set(eachCommittee.comCode!, committeeMembers!);
        }
        else{
          committeeMap.set(eachCommittee.comCode!, [eachMember.memberInfo.fullName]);
        }
      }

    }
  }
  return committeeMap;
}

/**
 * Function to convert member data into a format that can be used by the React graph
 * @param members - an array of Member objects
 * @returns an array where array[0] is an array of nodes and array[1] is an array of links between nodes
 */
export function formatDataForGraphByCommittee(members: Member[]): [any[], any[]]{
  const nodes: any[] = [];
  const links: any[] = [];
  const committeeMap: Map<string, string[]> = buildCommitteeMemberMap(members);
  const seenMembers: Set<string> = new Set<string>();
  for(const eachCommittee of committeeMap.keys()){
    let committeeMembers = committeeMap.get(eachCommittee);
    for(let i = 0; i < committeeMembers!.length; i++){
      if(!seenMembers.has(committeeMembers![i])){
        seenMembers.add(committeeMembers![i]);
        nodes.push({
          id: committeeMembers![i]
        });
      }
      for(let j = i+1; j < committeeMembers!.length; j++){
        links.push({
          source: committeeMembers![i],
          target: committeeMembers![j],
          value: eachCommittee
        })
      }
    }
  }
  return [nodes, links]
}