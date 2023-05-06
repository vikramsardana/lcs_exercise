import './App.css';
import { Link } from "react-router-dom";

/**
 * Displays the NavBar at the top of the page.
 * Allows for easy switching between the Member Information page and the Graph page
 */

const Navbar = () => {
  return (
    <div>
      <div className="NavBar">
        <ul>
          <Link to="/">
            <li>
              Members
            </li>
          </Link>
          <Link to="/Graph">
            <li>Graph</li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
