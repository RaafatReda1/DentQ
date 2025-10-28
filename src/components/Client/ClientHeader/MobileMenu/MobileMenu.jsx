import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import styles from "./MobileMenu.module.css";
import { IconButton } from "@mui/material";
import { MenuIcon } from "lucide-react";
import Links from "../Links/Links";
import { Directions } from "@mui/icons-material";
import SearchBar from "../SearchBar/SearchBar";
import LangDropDown from "../LangDropDown/LangDropDown";
import DropDownMenu from "../DropDownMenu/DropDownMenu";
const MobileMenu = ({ menuIsOpened, setMenuIsOpened }) => {
  return (
    <div className={styles.mobileMenu}>
      <div className={styles.mobileOnly}>
        <IconButton onClick={() => setMenuIsOpened(true)}>
          <MenuIcon />
        </IconButton>
      </div>
      <Drawer
        open={menuIsOpened}
        onClose={() => setMenuIsOpened(false)}
        anchor="left"
        PaperProps={{
          sx: {
            width: "80%",
          },
        }}
      >
        <div className={styles.mobileMenu}>
          <DropDownMenu menuIsOpened={menuIsOpened} />
          <SearchBar menuIsOpened={menuIsOpened} />
          <Links menuIsOpened={menuIsOpened} />
          <LangDropDown menuIsOpened={menuIsOpened} />
        </div>
      </Drawer>
    </div>
  );
};

export default MobileMenu;
