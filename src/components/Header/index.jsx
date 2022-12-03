import { AppBar, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./styles.scss";

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <Typography
          variant="h6"
          onClick={() => navigate("/")}
          className="headerTitle"
        >
          Analisador Léxico
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
