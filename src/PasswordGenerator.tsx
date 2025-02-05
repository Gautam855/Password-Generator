import React, { useState, useEffect } from "react";

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

const PasswordGenerator: React.FC = () => {
  // State hooks
  const [password, setPassword] = useState<string>("");
  const [passwordLength, setPasswordLength] = useState<number>(10);
  const [uppercase, setUppercase] = useState<boolean>(true);
  const [lowercase, setLowercase] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<boolean>(false);
  const [symbolsIncluded, setSymbolsIncluded] = useState<boolean>(false);
  const [strength, setStrength] = useState<string>("gray");

  // Password length slider handler
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordLength(Number(e.target.value));
  };

  // Checkbox change handler
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    switch (name) {
      case "uppercase":
        setUppercase(checked);
        break;
      case "lowercase":
        setLowercase(checked);
        break;
      case "numbers":
        setNumbers(checked);
        break;
      case "symbols":
        setSymbolsIncluded(checked);
        break;
      default:
        break;
    }
  };

  // Generate random password part functions
  const getRandomInteger = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min)) + min;

  const generateNumber = () => getRandomInteger(1, 10).toString();

  const generateLowercase = () =>
    String.fromCharCode(getRandomInteger(97, 123));

  const generateUppercase = () => String.fromCharCode(getRandomInteger(65, 91));

  const generateSymbol = () =>
    symbols.charAt(getRandomInteger(0, symbols.length));

  // Function to calculate password strength
  const calcStrength = () => {
    let hasUpper = uppercase;
    let hasLower = lowercase;
    let hasNumber = numbers;
    let hasSymbol = symbolsIncluded;

    if (
      hasUpper &&
      hasLower &&
      (hasNumber || hasSymbol) &&
      passwordLength >= 8
    ) {
      setStrength("green");
    } else if (
      (hasUpper || hasLower) &&
      (hasNumber || hasSymbol) &&
      passwordLength >= 6
    ) {
      setStrength("yellow");
    } else {
      setStrength("red");
    }
  };

  // Shuffle the password
  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = getRandomInteger(0, i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  };

  // Function to generate the password
  const generatePassword = () => {
    if (![uppercase, lowercase, numbers, symbolsIncluded].includes(true)) {
      alert("At least one checkbox must be selected.");
      return;
    }

    let passwordStr = "";
    const selectedFuncs: (() => string)[] = [];

    if (uppercase) selectedFuncs.push(generateUppercase);
    if (lowercase) selectedFuncs.push(generateLowercase);
    if (numbers) selectedFuncs.push(generateNumber);
    if (symbolsIncluded) selectedFuncs.push(generateSymbol);

    // Add required characters
    selectedFuncs.forEach((func) => (passwordStr += func()));

    // Fill the remaining length with random selections
    for (let i = passwordStr.length; i < passwordLength; i++) {
      const randomFunc =
        selectedFuncs[getRandomInteger(0, selectedFuncs.length)];
      passwordStr += randomFunc();
    }

    // Shuffle the password
    passwordStr = shuffleArray(Array.from(passwordStr));
    setPassword(passwordStr);
    calcStrength();
  };

  // Copy password to clipboard
  const copyContent = async () => {
    try {
      if (!password) throw new Error("First generate a password to copy");
      await navigator.clipboard.writeText(password);
      alert("Password copied!");
    } catch (error) {
      alert("Failed to copy password");
    }
  };

  // useEffect to recalculate password strength on change
  useEffect(() => {
    calcStrength();
  }, [
    password,
    passwordLength,
    uppercase,
    lowercase,
    numbers,
    symbolsIncluded,
  ]);

  return (
    <div className="wrapper">
      <div className="container">
        <h1 className="app-name">Password Generator</h1>

        <div className="display-container">
          <input type="text" readOnly value={password} className="display" />
          <button className="copy-btn" onClick={copyContent}>
            <img src="./images/copy.svg" alt="copy" className="copy-img" />
          </button>
        </div>

        <div className="input-container">
          <div className="length-container">
            <p>Password Length</p>
            <p>{passwordLength}</p>
          </div>

          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={passwordLength}
            onChange={handleSliderChange}
            className="slider"
          />

          <div className="checkbox-wrapper">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="uppercaseCb"
                name="uppercase"
                checked={uppercase}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="uppercaseCb">Includes Uppercase letters</label>
            </div>

            <div className="checkbox-container">
              <input
                type="checkbox"
                id="lowercaseCb"
                name="lowercase"
                checked={lowercase}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="lowercaseCb">Includes Lowercase letters</label>
            </div>

            <div className="checkbox-container">
              <input
                type="checkbox"
                id="numberCb"
                name="numbers"
                checked={numbers}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="numberCb">Includes Numbers</label>
            </div>

            <div className="checkbox-container">
              <input
                type="checkbox"
                id="symbolCb"
                name="symbols"
                checked={symbolsIncluded}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="symbolCb">Includes Symbols</label>
            </div>
          </div>

          <div className="strength-container">
            <p>Strength</p>
            <div
              className="indicator"
              style={{
                backgroundColor: strength,
                boxShadow: `0px 0px 12px 1px ${strength}`,
              }}
            ></div>
          </div>

          <button id="generateButton" onClick={generatePassword}>
            Generate Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
