import { useEffect } from "react";
import Card from "../Card";

export default function FightStart({
  pickedUpCard,
  versusCharacter,
  setVersusCharacter,
  selectedCharacter,
  setSelectedCharacter,
}) {
  const saveGameHistory = (tempSelectedCharacter, tempRandomCharacter) => {
    const tempGameHistory = localStorage.getItem("gameHistory");
    const gameHistory = tempGameHistory ? JSON.parse(tempGameHistory) : [];
    gameHistory.unshift({
      result: "Abandonned",
      selectedCharacter: tempSelectedCharacter,
      versusCharacter: tempRandomCharacter,
    });
    localStorage.setItem(
      "gameHistory",
      JSON.stringify(gameHistory.slice(0, 4))
    );
  };

  const fetchData = async () => {
    let tempSelectedCharacter;
    let tempRandomCharacter;
    const characterIdUrl = `https://hp-api.onrender.com/api/character/${pickedUpCard.idwizard}`;

    try {
      const response = await fetch(characterIdUrl);
      const data = await response.json();
      [tempSelectedCharacter] = data;
      setSelectedCharacter(tempSelectedCharacter);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }

    const charactersUrl = "https://hp-api.onrender.com/api/characters";

    try {
      const response = await fetch(charactersUrl);
      const data = await response.json();
      const randomNumber = Math.floor(Math.random() * data.length - 1);
      tempRandomCharacter = data[randomNumber];
      saveGameHistory(tempSelectedCharacter, tempRandomCharacter);
      setVersusCharacter(tempRandomCharacter);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="flex flex-col justify-around min-h-[calc(100vh-150px)] bg-[url('./image/fight.png')] bg-cover bg-center rounded-xl w-full">
      <div className="flex justify-evenly">
        <div className="justify-center items-center space-y-8">
          <div className="flex justify-around gap-4">
            {selectedCharacter && (
              <Card
                name={selectedCharacter.name}
                image={selectedCharacter.image}
                house={selectedCharacter.house}
                idwizard={selectedCharacter.id}
              />
            )}
          </div>
        </div>
        <div className="justify-center items-center space-y-8">
          <div className="flex justify-around gap-4">
            {versusCharacter && (
              <Card
                name={versusCharacter.name}
                image={versusCharacter.image}
                house={versusCharacter.house}
                idwizard={versusCharacter.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
