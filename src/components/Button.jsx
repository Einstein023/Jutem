import React from 'react';
import styled from 'styled-components';

const Button = ({ href = "/contact" }) => {
  return (
    <StyledWrapper>
      <a href={href} className="cta-btn">
        Talk To Us
        <div className="arrow-wrapper">
          <div className="arrow" />
        </div>
      </a>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .cta-btn {
    --primary-color: #2b558c;
    --secondary-color: #f0f4f9;
    --hover-color: #193355;
    --arrow-width: 10px;
    --arrow-stroke: 2px;
    box-sizing: border-box;
    border: 0;
    border-radius: 999px;
    corner-shape: squircle;
    color: var(--secondary-color);
    padding: 14px 28px;
    background: var(--primary-color);
    display: flex;
    text-transform: uppercase;
    text-decoration: none;
    transition: 0.3s background ease;
    align-items: center;
    gap: 0.6em;
    font-weight: normal;
  }

  .cta-btn .arrow-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cta-btn .arrow {
    margin-top: 1px;
    width: var(--arrow-width);
    background: var(--primary-color);
    height: var(--arrow-stroke);
    position: relative;
    transition: 0.2s;
  }

  .cta-btn .arrow::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    border: solid var(--secondary-color);
    border-width: 0 var(--arrow-stroke) var(--arrow-stroke) 0;
    display: inline-block;
    top: -3px;
    right: 3px;
    transition: 0.2s;
    padding: 3px;
    transform: rotate(-45deg);
  }

  .cta-btn:hover {
    background-color: var(--hover-color);
  }

  .cta-btn:hover .arrow {
    background: var(--secondary-color);
  }

  .cta-btn:hover .arrow:before {
    right: 0;
  }`;

export default Button;
