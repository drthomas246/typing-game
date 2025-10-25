import mapScreenShot from "../../public/readme/mapScreenShot.png";
import monsterScreenShot from "../../public/readme/monsterScreenShot.png";
import resultScreenShot from "../../public/readme/resultScreenShot.png";

export default function Table() {
  return (
    <table>
      <tr>
        <th>バトル画面</th>
        <th>結果画面</th>
        <th>マップ画面</th>
      </tr>
      <tr>
        <td>
          <img src={monsterScreenShot} alt="Monster Screen Shot" width="100%" />
        </td>
        <td>
          <img src={resultScreenShot} alt="Result Screen Shot" width="100%" />
        </td>
        <td>
          <img src={mapScreenShot} alt="Map Screen Shot" width="100%" />
        </td>
      </tr>
    </table>
  );
}
