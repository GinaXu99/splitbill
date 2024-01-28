import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


export default function App() {

  /**add new friend state */
  const [showfriend, setShowFriend] = useState(false);
  function onClickFriendForm() {
    setShowFriend((show) => !show);
  }


  /**friends list state */
  const [friends, setFriends] = useState(initialFriends);
  /**imporant dont mutate array use push, instead use destruct to create new array */
  function handleAddFriend(f) {
    setFriends((friends) => [...friends, f]);
    //hide addform once friend is added
    setShowFriend(false);
  }

  /**render billform based on selected friend */
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleFriendSelection(friend) {
    //setSelectedFriend(friend);
    setSelectedFriend((cur) => cur?.id === friend.id ? null : friend);
    //when bill form is selected then dont show add friend form
    setShowFriend(false);
  }

  /**handle split bill */
  function handleSplitBill(value) {
    console.log(value);
    setFriends(friends => friends.map(friend => friend.id === selectedFriend.id
      ? { ...friend, balance: friend.balance + value }
      : friend
    ))

    setSelectedFriend(null);
  }


  return (
    <div className="app">
      <div className="sidebar">
        <Friendslist
          friends={friends}
          selectedFriend={selectedFriend}
          onFriendSelection={handleFriendSelection}
        />

        {showfriend && <AddFriendForm
          onAddFriend={handleAddFriend} />}

        <Button onClick={onClickFriendForm} >{showfriend ? 'Close' : 'Add friend'}</Button>
      </div>
      {selectedFriend && <FormsSplitBill
        selectedFriend={selectedFriend}
        onSplitBill={handleSplitBill}
      />}

    </div>
  );
}


function Friendslist({ friends, onFriendSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map(friend =>
        <Friend friend={friend} key={friend.id}
          onFriendSelection={onFriendSelection}
          selectedFriend={selectedFriend}
        />)}
    </ul>
  )
};

function Friend({ friend, onFriendSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && <p className="red">You own {friend.name} ${Math.abs(friend.balance)}</p>}
      {friend.balance > 0 && <p className="green"> {friend.name} owes you ${friend.balance}</p>}
      {friend.balance === 0 && <p> You and {friend.name} are even</p>}

      <Button onClick={() => onFriendSelection(friend)}>

        {isSelected ? "Close" : "Select"} </Button>
    </li>
  )
}

function AddFriendForm({ onAddFriend }) {

  const [friendname, setFriendName] = useState('');
  const [imageURL, setImageURL] = useState('https://i.pravatar.cc/48?u=118836');

  function handleSubmit(e) {
    e.preventDefault();

    const id = crypto.randomUUID();
    const imageURL = 'https://i.pravatar.cc/48?u=118832';

    if (!friendname || !imageURL) return;

    const newFriend = {
      id,
      name: friendname,
      image: imageURL,
      balance: 0,

    };
    onAddFriend(newFriend);

    //reset after adding friend done
    setFriendName('');
    setImageURL('https://i.pravatar.cc/48?u=118836');
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <span>👭 Friend name </span>

      <input type="text"
        value={friendname}
        onChange={e => setFriendName(e.target.value)} />

      <span>🎑 image URL</span>

      <input type="text"
        value={imageURL}
        onChange={e => setImageURL(e.target.value)} />

      <Button>Add</Button>
    </form>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button"
      onClick={onClick}>{children}</button>
  )
}

function FormsSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");

  const paidByFriend = bill ? Math.abs(bill - paidByUser) : "";
  const [whoisPaying, setWhoisPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoisPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A WITH WITH {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input type="text"
        value={bill}
        onChange={e => setBill(Number(e.target.value))} />

      <label>🤣 Your expense</label>
      <input type="text"
        value={paidByUser}
        onChange={e => setPaidByUser(
          Number(e.target.value) > bill
            ? paidByUser
            : Number(e.target.value))} />

      <label>🤗 {selectedFriend.name}'s expense</label>
      <input type="text" value={paidByFriend} disabled />

      <label>👬 Who is paying the bill?</label>

      <select
        value={whoisPaying}
        onChange={e => setWhoisPaying(e.target.value)}>
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  )
}



