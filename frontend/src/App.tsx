import React from 'react';
import { Link } from "react-router-dom";
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import { useQuery } from "@apollo/client";
import { Member } from '../../backend/src/types';
import { GetMemberDataForTable } from './backend/queries';
import './App.css';

/**
 * Displays the Member Information table. The table is searchable (case-sensitive) by all fields except for Party, and includes a link to see more information about each member.
 * Data is fetched using a GraphQL query to get information about all members.
 * Displays the Member's Name, District, Party, Office Building, and Office Room.
 */
function App() {
  const [searchWord, setSearchWord] = React.useState<string>("");
  const { data, loading, error } = useQuery(GetMemberDataForTable, { errorPolicy: "all" });
  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;

  /**
   * Searches for Members with data matching the given searchWord
   * @returns filteredMembers, a list of matching members
   */
  const globalSearch = (): Member[] => {
		const filteredMembers = data.members.filter((member: Member) => {
			return (
				member.memberInfo.fullName.includes(searchWord) ||
				member.stateDistrict.includes(searchWord) ||
        member.memberInfo.officeBuilding.includes(searchWord) ||
        member.memberInfo.officeRoom.includes(searchWord)
			);
		});
		return filteredMembers;
	};

  const filteredMemberList: Member[] | [] = searchWord ? globalSearch() : data.members;

  return (
    <main className="app">
      <header>
        <h1>Member Information</h1>
      </header>
			<TextField
				value={searchWord}
				onChange={(event: any) => setSearchWord(event.target.value)}
				label="Search Members"
				variant="outlined"
			/>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>District</TableCell>
              <TableCell>Party</TableCell>
              <TableCell>Office Building</TableCell>
              <TableCell>Office Room</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {filteredMemberList.map((member: Member) =>
                <TableRow key={member.stateDistrict}>
                  <TableCell><Link to={`/members`} state={{ district: member.stateDistrict }}>{member.memberInfo.fullName}</Link></TableCell>
                  <TableCell>{member.stateDistrict}</TableCell>
                  <TableCell>{member.memberInfo.party}</TableCell>
                  <TableCell>{member.memberInfo.officeBuilding}</TableCell>
                  <TableCell>{member.memberInfo.officeRoom}</TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
    </main>
  );
}

export default App;
