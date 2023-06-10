import React from "react";
import classes from "./ItemOfPlaylist.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlay } from "@fortawesome/free-solid-svg-icons";
import { playListActions } from "../store/playlist";
import { Form, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
const ItemOfPlaylist = ({ index, item, trash }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className={classes.Item}>
      <div>
        <p>{index + 1}.</p>
        <div>
          <p> {item.songName}</p>
          <span>{item.artistName}</span>
        </div>
      </div>
      <div className="flex gap-8 text-white">
        <button
          onClick={() => {
            //dispatch(playListActions.setSong(item));
            navigate(`/details/${item.songName}`);
          }}
        >
          Details
        </button>
        <button
          onClick={() => {
            dispatch(playListActions.setSong(item));
          }}
        >
          <FontAwesomeIcon icon={faPlay} />
        </button>
        {trash && (
          <Form action="" method="">
            <input type="hidden" name="index" value={index} />
            <button>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ItemOfPlaylist;
