import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import instituteLogo from './assets/institute_logo.png';
import companyLogo from './assets/company_logo.jpg';

const AppBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: #ffffff;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: #ffffff;
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 40px;
  opacity: 0.85;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const ImageButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const ImageButton = styled.button`
  border: none;
  background: #ffffff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
  width: 250px;
  max-width: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  img {
    width: 100px;
    height: auto;
    margin-bottom: 10px;
    border-radius: 50%;

    @media (max-width: 480px) {
      width: 80px;
    }
  }

  p {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333333;

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

function Home() {
  const navigate = useNavigate();

  const handleInstituteClick = () => {
    sessionStorage.setItem('profile', 'Institute');
    navigate('/login');
  };

  const handleVerifierClick = () => {
    sessionStorage.setItem('profile', 'Verifier');
    navigate('/login');
  };

  return (
    <AppBackground>
      <Container>
        <Title>Certificate Validation System</Title>
        <Subtitle>Select Your Role</Subtitle>
        <ImageButtonContainer>
          <ImageButton onClick={handleInstituteClick}>
            <img src={instituteLogo} alt="Institute Logo" />
            <p>Institute</p>
          </ImageButton>
          <ImageButton onClick={handleVerifierClick}>
            <img src={companyLogo} alt="Company Logo" />
            <p>Verifier</p>
          </ImageButton>
        </ImageButtonContainer>
      </Container>
    </AppBackground>
  );
}

export default Home;
