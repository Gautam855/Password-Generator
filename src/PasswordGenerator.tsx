import React, { useState, useEffect } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [passwordLength, setPasswordLength] = useState<number>(10);
  const [uppercase, setUppercase] = useState<boolean>(true);
  const [lowercase, setLowercase] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<boolean>(false);
  const [symbolsIncluded, setSymbolsIncluded] = useState<boolean>(false);
  const [strength, setStrength] = useState<string>("gray");

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordLength(Number(e.target.value));
  };

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
    }
  };

  const getRandomInteger = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min)) + min;

  const generateNumber = () => getRandomInteger(1, 10).toString();
  const generateLowercase = () =>
    String.fromCharCode(getRandomInteger(97, 123));
  const generateUppercase = () => String.fromCharCode(getRandomInteger(65, 91));
  const generateSymbol = () =>
    symbols.charAt(getRandomInteger(0, symbols.length));

  const calcStrength = () => {
    const hasUpper = uppercase;
    const hasLower = lowercase;
    const hasNumber = numbers;
    const hasSymbol = symbolsIncluded;

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

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = getRandomInteger(0, i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  };

  const generatePassword = () => {
    if (![uppercase, lowercase, numbers, symbolsIncluded].includes(true)) {
      alert("Please select at least one option.");
      return;
    }

    let passwordStr = "";
    const selectedFuncs: (() => string)[] = [];

    if (uppercase) selectedFuncs.push(generateUppercase);
    if (lowercase) selectedFuncs.push(generateLowercase);
    if (numbers) selectedFuncs.push(generateNumber);
    if (symbolsIncluded) selectedFuncs.push(generateSymbol);

    selectedFuncs.forEach((func) => (passwordStr += func()));

    for (let i = passwordStr.length; i < passwordLength; i++) {
      const randomFunc =
        selectedFuncs[getRandomInteger(0, selectedFuncs.length)];
      passwordStr += randomFunc();
    }

    passwordStr = shuffleArray(Array.from(passwordStr));
    setPassword(passwordStr);
    calcStrength();
  };

  const copyContent = async () => {
    try {
      if (!password) throw new Error("Nothing to copy");
      await navigator.clipboard.writeText(password);
      alert("Password copied to clipboard!");
    } catch {
      alert("Failed to copy password.");
    }
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          🔐 Password Generator
        </h1>

        <div className="relative">
          <input
            type="text"
            readOnly
            value={password}
            className="w-full bg-gray-100 rounded-md p-3 pr-10 text-gray-700 font-mono"
            placeholder="Your password will appear here"
          />
          <button
            onClick={copyContent}
            className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
          >
            <ClipboardIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium text-gray-700">
            <label>Password Length</label>
            <span>{passwordLength}</span>
          </div>
          <input
            type="range"
            min="4"
            max="20"
            step="1"
            value={passwordLength}
            onChange={handleSliderChange}
            className="w-full accent-indigo-600"
          />

          <div className="grid gap-2">
            {[
              {
                id: "uppercase",
                label: "Include Uppercase Letters",
                checked: uppercase,
              },
              {
                id: "lowercase",
                label: "Include Lowercase Letters",
                checked: lowercase,
              },
              { id: "numbers", label: "Include Numbers", checked: numbers },
              {
                id: "symbols",
                label: "Include Symbols",
                checked: symbolsIncluded,
              },
            ].map(({ id, label, checked }) => (
              <label key={id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={id}
                  checked={checked}
                  onChange={handleCheckboxChange}
                  className="accent-indigo-600"
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm font-semibold text-gray-700">
              Strength
            </span>
            <div
              className={`h-4 w-16 rounded-full transition-all duration-300 ${
                strength === "green"
                  ? "bg-green-500 shadow-md shadow-green-300"
                  : strength === "yellow"
                  ? "bg-yellow-400 shadow-md shadow-yellow-200"
                  : "bg-red-500 shadow-md shadow-red-300"
              }`}
            ></div>
          </div>

          <button
            onClick={generatePassword}
            className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition-all duration-200"
          >
            Generate Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
