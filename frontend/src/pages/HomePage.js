import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home">
      <header>
        <div className="logo">SiteLogo</div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/team">Team</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <h1>UManitoba Found and Lost</h1>
        <p>The chances of finding your lost items have never been higher. Powered by advanced AI technology, our website transforms the search into a seamless and highly effective journey towards reclaiming what's yours!</p>
        <div className="buttons">
          <Link to="/lost-item" className="button">I have lost an item</Link>
          <Link to="/found-item" className="button">I have found an item</Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
