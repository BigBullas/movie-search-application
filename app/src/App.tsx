import classes from "./App.module.scss";
import { Link, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Converter from "./components/Converter";

function App() {
  console.log(classes);
  return (
    <div className={classes.App}>
      <nav className={classes.App_nav}>
        <div className="menu">
          <Link className={classes.App_nav_a} to="/">Home</Link>
          <Link className={classes.App_nav_a} to="/converter">Converter</Link>
        </div>
      </nav>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/converter" component={Converter} />
      </Switch>
    </div>
  );
}

export default App;
