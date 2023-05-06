import './App.css';
import ForceGraph2D from 'react-force-graph-2d';
import { useQuery } from "@apollo/client";
import { formatDataForGraphByCommittee } from './backend/graph';
import { GetMemberDataForGraph } from "./backend/queries";


/**
 * Displays the committees graph. This page is accessed by clicking the Graph link in the Navigation Bar.
 * Data is fetched using a GraphQL query to get information about all members and their committees.
 * Displays the member name when hovering over a node, and the specific committee in common when hovering over a link.
 */

function GraphApp() {
  const { data, loading, error } = useQuery(GetMemberDataForGraph, { errorPolicy: "all" });
  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;
  const graphData = formatDataForGraphByCommittee(data.members);
  const graphDataProper = {
    nodes: graphData[0],
    links: graphData[1]
  }

  return (
    <main className="app">
      <header>
        <h1>Member Information</h1>
      </header>

      <ForceGraph2D
      graphData={graphDataProper}
      nodeLabel={(node) => {
        return node.id;
      }}
      linkLabel={(link) => {
        return link.value;
      }}
      nodeAutoColorBy={'id'}
      nodeRelSize={8}
    />
    </main>
  );
}

export default GraphApp;
