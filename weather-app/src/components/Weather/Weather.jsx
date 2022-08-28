import "./Weather.css"
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";


import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  
} from "recharts";



function Weather() {
  const [city, setCity] = useState("Patna");
  const [area, setArea] = useState("");
  const [days, setDays] = useState([]);
  
  const [tempgraph, setTempgraph] = useState("");
  const [tempicon, setTempicon] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [pressure, setPressure] = useState("");
  const [humidity, setHumidity] = useState("");
  const [loading, setLoading] = useState(true);
  let waiting;
  const hourTempArray = useRef([]);

  // ....fetch the weather city....


  const FindCity = () => {
    
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0f95bf2cdc2b5c87c680a1e9231923e8&units=metric`
        )
        .then((res) => {
          weekday(res.data.coord.lat, res.data.coord.lon);
        })
        .catch((err) => {
          console.log(err);
        });
  
  };
  const weekday = (lat, lon) => {
   
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=0f95bf2cdc2b5c87c680a1e9231923e8&units=metric`
        )
        .then((res) => {
          setDays(res.data.daily);
        })
        .catch((err) => {
          console.log(err);
        });
  
  };
  useEffect(() => {
    FindCity()
       
  }, []);


  const Live = () => {
    axios
      .get(" https://ipinfo.io/json?token=52ed0181817dc8")
      .then((response) => {
        setCity(response.data.city);
        setArea(response.data.area);
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${response.data.city}&appid=0f95bf2cdc2b5c87c680a1e9231923e8&units=metric`
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
            info(
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

      .catch((error) => {
        console.log("something wrong", error);
      });
  };
  
  

  const info = (graph, icon, sunRise, sunSet, presure, humdity, e) => {
    console.log(e, "checking one day data");
    let arr = [];
    let hrRise = new Date(sunRise * 1000).getHours();
    let minRise = "0" + new Date(sunRise * 1000).getMinutes();
    let hrSet = new Date(sunSet * 1000).getHours();
    let minSet = "0" + new Date(sunSet * 1000).getMinutes();
    let rise = (hrRise % 12)  + ":" + minRise.substr(-2);
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
    setTempgraph(graph);
    setTempicon(icon);
    setSunrise(rise);
    setSunset(set);
    setPressure(presure);
    setHumidity(humdity);
  };

  useEffect(() => {
    Live();
    setTimeout(() => setLoading(false), 1000);
  }, []);

  
  


  const sunData = [
    {
      sun: `${sunrise}am<:${new Date(
        sunrise
      ).getMinutes()} am`,
      value: 0,
    },
    { sun: "", value: 10 },
    {
      sun: `${sunset}pm:${new Date(
        sunset
      ).getMinutes()} pm`,
      value: 0,
    },
  ];
  const Sungraph = ({ active, label }) => {
    if (active) {
      return (
        <div>
          {label.slice(-2) === "am" ? (
            <div className="sun-graph">
              <strong>Sunrise</strong>
              <p>{sunrise}am</p>
            </div>
          ) : label.slice(-2) === "pm" ? (
            <div className="sun-graph">
              <strong>Sunset</strong>
              <p>{sunset}pm</p>
            </div>
          ) : (
            ""
          )}
        </div>
      );
    }
    return null;
  };
  
 
  

  
 
  return loading ? (
    <div className="load">
    Loding waiting for update !
    </div>
  ) : (
    <div className="displays">
      <div className="search">
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
        <button className="searchIcon" onClick={FindCity}>
          <SearchOutlinedIcon fontSize="medium" style={{marginRight:"170px"}}/>
        </button>
      </div>
      <div  id="detail">
        {days.map((e) => (
          <div
            id="detailInsideDiv"
            key={e.id}
            onClick={() => {
              info(
                e.temp.day,
                e.weather[0].icon,
                e.sunrise,
                e.sunset,
                e.pressure,
                e.humidity,
                e
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
          <span>{Math.round(tempgraph)}℃</span>
         
         
          <img
            className="tempIcon"
            src={`https://openweathermap.org/img/wn/${tempicon}.png`}
            alt=""
          />
         
        </div>
        <Chart
          type="line"
          series={[
            {
              
              data: [...hourTempArray.current],
            },
          ]}
          options={{
            dataLabels: {
              formatter: (item) => {
              },
            },
            yaxis: {
              labels: {
                formatter: (item) => {
                  return `${Math.ceil(item)}℃`;
                },
              },
            },
            
            xaxis: {
              categories: ["6:00am", "9:00am", "12:00pm", "3:00pm", "6:00pm"],
            },
          }}
        />



        <div className="middata">
          <div>
            <div className="set">Pressure</div>
            <div>{pressure} hpa</div>
          </div>
          <div>
            <div className="set">Humidity</div>
            <div>{humidity} %</div>
          </div>
          
        </div>
        <div className="middata">
          <div>
            <div className="set">Sunrise</div>
            <div>{sunrise}am</div>
          </div>
          <div>
            <div className="set">Sunset</div>
            <div>{sunset}pm</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={sunData}>
                
                <XAxis
                  dataKey="suns"
                  padding={{ left: 50, right: 50 }}
                  tickLine={false}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#dc5349"
                  fillOpacity={1}
                  fill="url(#sun-color)"
                />

                <Tooltip content={<Sungraph />} />
              </AreaChart>
              
            </ResponsiveContainer>
            <div className="lastdata">
          <div>
           
            <div>{sunrise}am</div>
          </div>
          <div>
            
            <div>{sunset}pm</div>
          </div>
        </div>
      </div>
     

      
    </div>
  );
}

export default Weather;

