import React from 'react'
import {Link} from "react-router-dom";

export const Navbar = () => {
  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
              <Link to="/">文章列表</Link>
              <Link to="/users">作者列表</Link>
          </div>
        </div>
      </section>
    </nav>
  )
}
