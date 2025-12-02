import { Button, message, Progress } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { GrClearOption } from "react-icons/gr";
import { IoCopy } from "react-icons/io5";

interface Result {
  name: string;
  icon: React.ComponentType;
  value: number;
  bg: string;
  color: string;
}

interface RepeatChar {
  char: string;
  count: number;
  percent: number;
}
function App() {
  const [characters, setCharacters] = useState<number>(0);
  const [words, setWords] = useState<number>(0);
  const [sentences, setSentences] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const characterPerPage = 1000;
  const [text, setText] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const [mostRepeatChars, setMostRepeatChars] = useState<RepeatChar[]>([]);
  const results: Result[] = [
    {
      name: "Characters",
      icon: IoCopy,
      value: characters,
      bg: "var(--main-color)",
      color: "white",
    },
    {
      name: "Words",
      icon: IoCopy,
      value: words,
      bg: "white",
      color: "var(--main-color)",
    },
    {
      name: "Sentences",
      icon: IoCopy,
      value: sentences,
      bg: "white",
      color: "var(--main-color)",
    },
    {
      name: "Pages",
      icon: IoCopy,
      value: pages,
      bg: "white",
      color: "var(--main-color)",
    },
  ];
  const chars = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  // calculate characters
  useEffect(() => {
    setCharacters(text?.length);
  }, [text]);

  // calculate words
  useEffect(() => {
    if (text.trim().length == 0) {
      setWords(0);
    } else {
      setWords(text.trim().split(/\s+/).length);
    }
  }, [text]);

  // calculate sentences
  useEffect(() => {
    if (!text) {
      setSentences(0);
      return;
    }
    const sentenceRegex = /[^.!?]+[.!?]+/g; // match phrases ending with . ! ?
    const matches = text.match(sentenceRegex);
    setSentences(matches ? matches.length : 0);
  }, [text]);

  // calculate pages
  useEffect(() => {
    setPages(Math.floor(characters / characterPerPage));
  }, [characters]);

  // must common used characters
  useEffect(() => {
    const upperText = text.toUpperCase();

    let theChars = chars;

    for (let i = 0; i < 4; i++) {
      let mostRepeatCount: number = 0;
      let mostRepeatChar: string | null = null;
      for (let char of theChars) {
        const repeat = upperText.split(char).length - 1;
        if (mostRepeatCount < repeat) {
          mostRepeatCount = repeat;
          mostRepeatChar = char;
        }
      }

      setMostRepeatChars((prev) => {
        const newMostRepeatChars = structuredClone(prev);
        newMostRepeatChars[i] = {
          char: mostRepeatChar ? mostRepeatChar : "",
          count: mostRepeatCount,
          percent: Math.floor((mostRepeatCount / text?.length) * 100),
        };
        return newMostRepeatChars;
      });

      theChars = theChars.filter((char) => char != mostRepeatChar);
    }
  }, [text]);

  return (
    <div className="w-full flex justify-between py-6 px-8">
      {contextHolder}
      <div className="w-[1000px] max-w-[90%] mx-auto">
        <h1 className="text-center font-black text-[20px] text-main-color">
          Character Counter
        </h1>
        {/* results */}
        <div className="grid grid-cols-4 gap-x-3 mt-4">
          {results?.map((result, index: number) => {
            return (
              <div
                key={"result" + index}
                className="shadow h-[70px] rounded-lg flex items-center
              justify-center"
                style={{
                  backgroundColor: result?.bg,
                  color: result?.color,
                }}
              >
                <span className="block text-center text-[18px]">
                  {result?.name}: {result?.value}
                </span>
              </div>
            );
          })}
        </div>

        <TextArea
          rows={12}
          className="!mt-4"
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setText(e.currentTarget.value)
          }
        />

        {/* buttons */}
        <div className="flex items-center justify-start gap-x-2 mt-4">
          <Button
            type="primary"
            className="!bg-red-500 text-white"
            onClick={() => setText("")}
          >
            <GrClearOption />
            Clear
          </Button>
          <Button
            className="!border-main-color !text-main-color"
            onClick={() => {
              navigator.clipboard
                .writeText(text)
                .then(() => {
                  messageApi.success("The text copied!");
                })
                .catch(() => {
                  messageApi.error("Failed");
                });
            }}
          >
            <IoCopy />
            Copy
          </Button>
        </div>

        {/* Statistics */}
        <div className="mt-10">
          {mostRepeatChars?.map((mostRepeatChar: RepeatChar, index: number) => {
            return (
              <div
                key={"mostRepeatChar" + index}
                style={{
                  display: mostRepeatChar?.char ? "block" : "none",
                }}
              >
                <span>{mostRepeatChar?.char}</span>
                <Progress percent={mostRepeatChar?.percent} status="normal" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
