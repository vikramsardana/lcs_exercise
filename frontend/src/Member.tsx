import './App.css';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useLocation } from 'react-router-dom'
import { GetIndividualMemberData } from './backend/queries';
import { useQuery } from "@apollo/client";

/**
 * Displays information about each member. This page is accessed by clicking a link in the Member Information table.
 * Data is fetched using a GraphQL query to get information about an individual member, given the district
 * Displays the Member's offical name, formal name, party, district, home town, and a table with their committee and subcommitte information (committee, rank, leadership)
 */

function MemberApp() {
    const location = useLocation();
    const { district } = location.state;
    const { data, loading, error } = useQuery(GetIndividualMemberData, { variables: { stateDistrict: district }, errorPolicy: "all" });
    if (loading) return <div>Loading</div>;
    if (error) return <div>Error</div>;
    const memberInfo = data.member.memberInfo;
    return (
        <main className="app">
            <header>
                <h1>Information about {district}</h1>
            </header>
            <p>Official Name: {memberInfo.officialName}</p>
            <p>Formal Name: {memberInfo.formalName}</p>
            <p>Party: {memberInfo.party}</p>
            <p>District: {memberInfo.district}</p>
            <p>Hometown: {memberInfo.townName}</p>
            <header>
                <h2>
                    Committees
                </h2>
            </header>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Committee</TableCell>
                        <TableCell>Rank</TableCell>
                        <TableCell>Leadership</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {memberInfo.committeeAssignments.committee.map((eachCommittee: any) =>
                        <TableRow key={eachCommittee.comCode}>
                            <TableCell>{eachCommittee.comCode}</TableCell>
                            <TableCell>{eachCommittee.rank}</TableCell>
                            <TableCell>{eachCommittee.leadership}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <header>
                <h2>
                    Subcommittees
                </h2>
            </header>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Subcommittee</TableCell>
                        <TableCell>Rank</TableCell>
                        <TableCell>Leadership</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {memberInfo.committeeAssignments.subcommittee.map((eachSubcommittee: any) =>
                        <TableRow key={eachSubcommittee.subcomCode}>
                            <TableCell>{eachSubcommittee.subcomCode}</TableCell>
                            <TableCell>{eachSubcommittee.rank}</TableCell>
                            <TableCell>{eachSubcommittee.leadership}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </main>
    );
}

export default MemberApp;
