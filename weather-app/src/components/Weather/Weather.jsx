import "./Weather.css"
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";


function Weather() {
  const [city, setCity] = useState("Bhagalpur");
  const [region, setRegion] = useState("");
  const [days, setDays] = useState([]);
  const [tempgraph, setTempgraph] = useState("");
  const [tempicon, setTempicon] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [pressure, setPressure] = useState("");
  const [humidity, setHumidity] = useState("");
  const [spinner, setSpinner] = useState(true);
  let waiting;
  const hourTempArray = useRef([]);

  // ....fetch the weather city....
  const searchCity = () => {
    try {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=44d2f0f421a5b483b38e2ea12704107e&units=metric`
        )
        .then((res) => {
          weekday(res.data.coord.lat, res.data.coord.lon);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {}
  };
  const weekday = (lat, lon) => {
    try {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=44d2f0f421a5b483b38e2ea12704107e&units=metric`
        )
        .then((res) => {
          setDays(res.data.daily);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch {}
  };
  useEffect(() => {
    searchCity();
  }, []);


  const takeLocation = () => {
    axios
      .get(" https://ipinfo.io/json?token=52ed0181817dc8")
      .then((response) => {
        setCity(response.data.city);
        setRegion(response.data.region);
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${response.data.city}&appid=44d2f0f421a5b483b38e2ea12704107e&units=metric`
          )
          .then((res) => {
            console.log(res.data, "onlocation");
            weekday(res.data.coord.lat, res.data.coord.lon);
            let arr = [];
            let count = 3;
            for (let x in res.data.main) {
              if (count > 2) {
                count--;
              } else {
                count++;
              }
              if (x == "feels_like" || "temp" || "temp_max" || "temp_min") {
                arr.push(res.data.main[x] + count + "℃");
              } else {
                continue;
              }
            }
            arr = arr.splice(0, 4);
            detailDiv(
              res.data.main.temp,
              res.data.weather[0].icon,
              res.data.sys.sunrise,
              res.data.sys.sunset,
              res.data.main.pressure,
              res.data.main.humidity,
              arr
            );
          })
          .catch((err) => {
            console.log(err);
          });
      })

      .catch((status) => {
        console.log("Request failed.  Returned status of", status);
      });
  };
  
  

  const detailDiv = (data1, data2, sunRise, sunSet, presure, humdity, e) => {
    console.log(e, "checking one day data");
    let arr = [];
    let hrRise = new Date(sunRise * 1000).getHours();
    let minRise = "0" + new Date(sunRise * 1000).getMinutes();
    let hrSet = new Date(sunSet * 1000).getHours();
    let minSet = "0" + new Date(sunSet * 1000).getMinutes();
    let rise = hrRise + ":" + minRise.substr(-2);
    let set = (hrSet % 12) + ":" + minSet.substr(-2);
    let result = Array.isArray(e);
    if (result == false) {
      for (let x in e.temp) {
        arr.push(e.temp[x] + "℃");
      }
      arr = arr.splice(0, 4);
      hourTempArray.current = arr;
    } else {
      hourTempArray.current = e;
    }
    setTempgraph(data1);
    setTempicon(data2);
    setSunrise(rise);
    setSunset(set);
    setPressure(presure);
    setHumidity(humdity);
  };

  useEffect(() => {
    takeLocation();
    setTimeout(() => setSpinner(false), 1000);
  }, []);
 
  return spinner ? (
    <div className="spinner">
    Loding
    </div>
  ) : (
    <div className="display">
      <div className="searchbar">
        <button className="location">
          <LocationOnIcon />
        </button>

        <input
          type="text"
          className="input"
          placeholder="Search"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            
          }}
        />
        <button className="searchIcon" onClick={searchCity}>
          <SearchOutlinedIcon fontSize="medium" style={{marginRight:"170px"}}/>
        </button>
      </div>
      <div  id="detail">
        {days.map((e) => (
          <div
            id="detailInsideDiv"
            key={e.id}
            onClick={() => {
              detailDiv(
                e.temp.day,
                e.weather[0].icon,
                e.sunrise,
                e.sunset,
                e.pressure,
                e.humidity,
                
              );
            }}
            tabIndex="1"
          >
            
          
            <div >
              {new Date(`${e.dt}` * 1000).toLocaleDateString("en", {
                weekday: "short",
              })}
            </div>
            <span >{Math.round(e.temp.max)}° {Math.round(e.temp.min)}°</span>
            
          <div>  <img
            
              src={`https://openweathermap.org/img/wn/${e.weather[0].icon}.png`}
              alt=""
            />
            </div>

            <div>{e.weather[0].main}</div>
          </div>
        ))}
      </div>


      <div className="tempChart">
        <div className="tempChartTemp">
          <span>{Math.ceil(tempgraph)}℃</span>
          <img
            className="tempIcon"
            src={`https://openweathermap.org/img/wn/${tempicon || "10d"}.png`}
            alt=""
          />
        </div>
        <Chart
          type="area"
          series={[
            {
              name: "Temperature",
              data: [...hourTempArray.current],
            },
          ]}
          options={{
            dataLabels: {
              formatter: (val) => {
              },
            },
            yaxis: {
              labels: {
                formatter: (val) => {
                  return `${Math.ceil(val)}℃`;
                },
              },
            },
            xaxis: {
              categories: ["12:00am", "6:00am", "12:00pm", "6:00pm"],
            },
          }}
        />

        <div className="PressureHumidity">
          <div>
            <div className="pressure">Pressure</div>
            <div>{pressure || 1210} hpa</div>
          </div>
          <div>
            <div className="humidity">Humidity</div>
            <div>{humidity || 43} %</div>
          </div>
        </div>
        <div className="sunriseSunset">
          <div>
            <div className="sunrise">Sunrise</div>
            <div>{sunrise || "6:00"}am</div>
          </div>
          <div>
            <div className="sunset">Sunset</div>
            <div>{sunset || "7:00"}pm</div>
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default Weather;

