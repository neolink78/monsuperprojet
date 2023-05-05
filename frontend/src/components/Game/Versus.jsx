import { useState, useEffect } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2/dist/sweetalert2.all.min";
import Card from "../Card";
import CharSpells from "./Spells";

function Versus({ versusCharacter, selectedCharacter }) {
  const [currentTurn, setCurrentTurn] = useState("player"); // "player" or "enemy"

  const MySwal = withReactContent(Swal);

  const setGameResult = (result) => {
    const gameHistory = JSON.parse(localStorage.getItem("gameHistory"));
    gameHistory[0].result = result;
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
  };

  // All Stats
  const [selectedCharacterHP, setSelectedCharacterHP] = useState(200);
  const [hasUsedHP, setHasUsedHP] = useState(false);
  const [selectedCharacterHasUsedHP, setSelectedCharacterHasUsedHP] =
    useState(false);
  const [selectedCharacterDP, setSelectedCharacterDP] = useState(
    Math.floor(Math.random() * 30) + 100
  );
  const [hasUsedDP, setHasUsedDP] = useState(false);
  const [selectedCharacterHasUsedDP, setSelectedCharacterHasUsedDP] =
    useState(false);

  const [selectedCharacterAP, setSelectedCharacterAP] = useState(
    Math.floor(Math.random() * 30) + 100
  );
  const [versusCharacterHP, setVersusCharacterHP] = useState(200);
  const [enemyHasUsedHP, setEnemyHasUsedHP] = useState(false);
  const [versusCharacterDP, setVersusCharacterDP] = useState(
    Math.floor(Math.random() * 30) + 100
  );
  const [enemyHasUsedDP, setEnemyHasUsedDP] = useState(false);

  const [versusCharacterAP, setVersusCharacterAP] = useState(
    Math.floor(Math.random() * 30) + 100
  );
  // HP Stats
  const getHP = (enemyId) => {
    const healthPoints = Math.floor(Math.random() * 30) + 10; // HP aléatoires entre 10 et 30
    if (
      versusCharacter &&
      selectedCharacter &&
      selectedCharacter.id === enemyId
    ) {
      setSelectedCharacterHP(selectedCharacterHP + healthPoints);
      setSelectedCharacterHasUsedHP(!hasUsedHP);
      setHasUsedHP(!hasUsedHP);
      setSelectedCharacterAP(selectedCharacterAP);
      setSelectedCharacterDP(selectedCharacterDP);
    }
    if (
      selectedCharacter &&
      versusCharacter &&
      versusCharacter.id === enemyId
    ) {
      setVersusCharacterHP(versusCharacterHP + healthPoints);
      setEnemyHasUsedHP(!hasUsedHP);
      setHasUsedHP(!hasUsedHP);
      setVersusCharacterAP(versusCharacterAP);
      setVersusCharacterDP(versusCharacterDP);
    }
  };

  // DP Stats
  const addDP = (enemyId) => {
    if (
      versusCharacter &&
      selectedCharacter &&
      selectedCharacter.id === enemyId
    ) {
      const myDefencePoints = Math.round(selectedCharacterDP * 0.8);
      setSelectedCharacterDP(selectedCharacterDP + myDefencePoints);
      setSelectedCharacterHasUsedDP(!selectedCharacterHasUsedDP);
      setHasUsedDP(!hasUsedDP);
      setSelectedCharacterAP(selectedCharacterAP);
    }
    if (
      selectedCharacter &&
      versusCharacter &&
      versusCharacter.id === enemyId
    ) {
      const enemyDefencePoints = Math.round(versusCharacterDP * 0.8);
      setVersusCharacterDP(versusCharacterDP + enemyDefencePoints);
      setEnemyHasUsedDP(!enemyHasUsedDP);
      setHasUsedDP(!hasUsedDP);
      setVersusCharacterAP(versusCharacterAP);
    }
  };

  const startDamage = (enemyId) => {
    const damage = Math.floor(Math.random() * 30) + 10; // dégâts aléatoires entre 10 et 30
    const enemyTurn = () => {
      setCurrentTurn("player");
      startDamage(selectedCharacter.id);
    };
    if (
      currentTurn === "player" &&
      selectedCharacter &&
      versusCharacter &&
      versusCharacter.id === enemyId
    ) {
      setVersusCharacterHP(
        versusCharacterHP - (damage + Math.round(selectedCharacterAP * 0.05))
      );
      if (versusCharacterHP - damage <= 0) {
        setVersusCharacterHP(0);
        setGameResult("Won");
        MySwal.fire({
          title: <strong>YEAH!</strong>,
          html:
            `<i>You beat ${versusCharacter.name}, you won the Triwizard Cup!</i>` +
            "<br/>" +
            "<br/>" +
            "<a href='/' style=color:D3A625>Back to Home</a>",
          iconHtml: '<img src="/image/cup.png" />',
          showConfirmButton: false,
          allowOutsideClick: false,
        });
      } else {
        setCurrentTurn("enemy");
        setTimeout(enemyTurn, 1000);
      }
    }
    if (
      currentTurn === "enemy" &&
      versusCharacter &&
      selectedCharacter &&
      selectedCharacter.id === enemyId
    ) {
      setSelectedCharacterHP(
        selectedCharacterHP - (damage + Math.round(versusCharacterAP * 0.05))
      );
      if (selectedCharacterHP - damage <= 0) {
        setSelectedCharacterHP(0);
        setGameResult("Lost");
        MySwal.fire({
          title: <strong>Oh no!</strong>,
          html:
            `<i>${versusCharacter.name} beat you...</i>` +
            "<br/>" +
            "<br/>" +
            "<a href='/' style=color:D3A625>Back to Home</a>",
          iconHtml: '<img src="/image/scar.png" />',
          showConfirmButton: false,
          allowOutsideClick: false,
        });
      }
      if (versusCharacterHP <= 50 && !enemyHasUsedHP) {
        getHP(versusCharacter.id);
        addDP(versusCharacter.id);
      } else {
        setCurrentTurn("player");
      }
    }
  };

  useEffect(() => {
    if (currentTurn === "enemy") {
      setTimeout(() => startDamage(selectedCharacter.id), 1000);
    }
  }, [currentTurn, selectedCharacter]);

  return (
    <div className="flex flex-col justify-around min-h-[calc(100vh-200px)] bg-[url('./image/wood.jpg')] bg-cover rounded-xl w-full">
      <div className="flex justify-around items-center">
        <div className="justify-center items-center space-y-24">
          <div className="flex justify-around gap-8">
            <div className="flex flex-col justify-center items-center gap-8 potions">
              <button type="button">
                AP ⚔️
                {selectedCharacterAP}
              </button>
              <button type="button">
                DP 🛡️
                {selectedCharacterDP}
              </button>
              <button type="button">
                HP ❤️
                {selectedCharacterHP}
              </button>
            </div>
            {selectedCharacter && (
              <Card
                name={selectedCharacter.name}
                image={selectedCharacter.image}
                house={selectedCharacter.house}
                idwizard={selectedCharacter.id}
                HP={selectedCharacterHP}
                AP={selectedCharacterAP}
                DP={selectedCharacterDP}
              />
            )}
          </div>
          <CharSpells
            house={selectedCharacter?.house}
            startDamage={() => startDamage(versusCharacter.id)}
            getHP={() => getHP(selectedCharacter.id)}
            hasUsedHP={selectedCharacterHasUsedHP}
            characterHP={selectedCharacterHP}
            addDP={() => addDP(selectedCharacter.id)}
            hasUsedDP={selectedCharacterHasUsedDP}
            disabled={currentTurn === "enemy"}
          />
        </div>
        <div className="justify-center items-center space-y-24">
          <div className="flex justify-around gap-8">
            {versusCharacter && (
              <Card
                name={versusCharacter.name}
                image={versusCharacter.image}
                house={versusCharacter.house}
                idwizard={versusCharacter.id}
                HP={versusCharacterHP}
                AP={versusCharacterAP}
                DP={versusCharacterDP}
              />
            )}
            <div className="flex flex-col justify-center items-center gap-8 potions">
              <button type="button">
                AP ⚔️
                {versusCharacterAP}
              </button>
              <button type="button">
                DP 🛡️
                {versusCharacterDP}
              </button>
              <button type="button">
                HP ❤️
                {versusCharacterHP}
              </button>
            </div>
          </div>
          <CharSpells
            house={versusCharacter?.house}
            startDamage={() => startDamage(selectedCharacter.id)}
            disabled={currentTurn === "player"}
          />
        </div>
      </div>
    </div>
  );
}

export default Versus;
