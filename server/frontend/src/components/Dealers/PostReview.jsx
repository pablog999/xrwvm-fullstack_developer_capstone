import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const curr_url = window.location.href;
  const root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
  const { id } = useParams();
  const dealer_url = `${root_url}djangoapp/dealer/${id}`;
  const review_url = `${root_url}djangoapp/add_review`;
  const carmodels_url = `${root_url}djangoapp/cars`; // ✅ fixed URL

  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }

    if (!model || review === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    const model_split = model.split(" ");
    const make_chosen = model_split[0];
    const model_chosen = model_split.slice(1).join(" "); // Supports multi-word model names

    const jsoninput = JSON.stringify({
      name: name,
      dealership: id,
      review: review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    });

    try {
      const res = await fetch(review_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsoninput,
      });

      const json = await res.json();
      if (json.status === 200) {
        window.location.href = `${window.location.origin}/dealer/${id}`;
      } else {
        alert("Failed to submit review.");
      }
    } catch (err) {
      console.error("Error posting review:", err);
    }
  };

  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url);
      const retobj = await res.json();
      if (retobj.status === 200 && retobj.dealer) {
        setDealer(retobj.dealer); // ✅ fixed use of object
      }
    } catch (err) {
      console.error("Failed to fetch dealer info:", err);
    }
  };

  const get_cars = async () => {
    try {
      const res = await fetch(carmodels_url);
      const retobj = await res.json();
      if (retobj.CarModels && Array.isArray(retobj.CarModels)) {
        setCarmodels(retobj.CarModels); // ✅ safe update
      } else {
        console.warn("Car model list empty or invalid.");
      }
    } catch (err) {
      console.error("Failed to fetch car models:", err);
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name || "Loading dealer..."}</h1>

        <textarea
          id='review'
          cols='50'
          rows='7'
          placeholder="Write your review here..."
          onChange={(e) => setReview(e.target.value)}
        />

        <div className='input_field'>
          Purchase Date <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className='input_field'>
          Car Make & Model
          <select
            name="cars"
            id="cars"
            defaultValue=""
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="" disabled hidden>Choose Car Make and Model</option>
            {carmodels.map((car, idx) => (
              <option key={idx} value={`${car.CarMake} ${car.CarModel}`}>
                {car.CarMake} {car.CarModel}
              </option>
            ))}
          </select>
        </div>

        <div className='input_field'>
          Car Year <input
            type="number"
            min="2015"
            max="2023"
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2020"
          />
        </div>

        <div>
          <button className='postreview' onClick={postreview}>Post Review</button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
