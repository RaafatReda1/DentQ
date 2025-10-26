import React from "react";
import styled from "styled-components";

const LangDropDown = () => {
  return (
    <StyledWrapper>
      <div className="menu">
        <div className="item">
          <a href="#" className="link">
            <span className="world">🌐</span>
            <span>Language</span>
            <svg viewBox="0 0 360 360" xmlSpace="preserve">
              <g id="SVGRepo_iconCarrier">
                <path
                  id="XMLID_225_"
                  d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                />
              </g>
            </svg>
          </a>

          <div className="submenu">
            <div className="submenu-item egypt">
              <a href="#" className="submenu-link">
                🇪🇬 عربي
              </a>
            </div>
            <div className="submenu-item usa">
              <a href="#" className="submenu-link">
                🇺🇸 English
              </a>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const textColor = "#000000";
const hoverTextColor = "#ffffff";

const StyledWrapper = styled.div`
  .menu {
    font-size: 16px;
    display: flex;
    width: fit-content;
    list-style: none;
    padding:0;
    margin:0;
  }

  .menu a {
    text-decoration: none;
    color: inherit;
    font-family: inherit;
  }

  .menu .link {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 16px 16px 0 0;
    padding:10px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index:3;
  }

  .menu .link span {
    transition: transform 0.3s ease;
    z-index: 3;
  }
.menu .link .world{
    font-size: 1.5em;

}
  .menu .link::after {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: var(--highlight-color);
    transform: scaleX(0);
    transform-origin: left;
    z-index: -1;
    transition: transform 0.3s ease;
    z-index:2;
  }

  .menu .link svg {
    width: 14px;
    height: 14px;
    fill: ${textColor};
    transition: all 0.3s ease;
  }

  .menu .item {
    position: relative;
  }

  .menu .item:hover .link::after {
    transform: scaleX(1);
    transform-origin: right;
  }

  .menu .item:hover .link svg {
    fill: ${hoverTextColor};
    transform: rotate(-180deg);
  }

  .menu .item:hover .link .world {
    transform: rotate(20deg);
  }

  .menu .item .submenu {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    border-radius: 0 0 16px 16px;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    pointer-events: none;
    z-index: 10;
    border: 1px solid var(--highlight-color);
  }

  .menu .item:hover .submenu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
  }

  .submenu .submenu-item {
    width: 100%;
  }

  .submenu .submenu-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 20px;
    position: relative;
    text-align: center;
    color: ${textColor};
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .submenu .submenu-link::before {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    transform: scaleX(0);
    transform-origin: left;
    z-index: -1;
    transition: transform 0.3s ease;
    border-radius: 0 0 16px 16px;
  }

  .submenu .egypt .submenu-link::before {
    background: var(--highlight-color);
  }

  .submenu .usa .submenu-link::before {
    background:var(--highlight-color);
  }

  .submenu .submenu-link:hover::before {
    transform: scaleX(1);
    transform-origin: right;
  }

  .submenu .submenu-link:hover {
    color: ${hoverTextColor};
  }
`;

export default LangDropDown;
