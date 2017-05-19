{
 viewer {
   id
  accepted: cards(state: "accepted") {
    ...cardDetails
  }
  in_progress: cards(state: "in_progress") {
    ...cardDetails
    owner {
      name
    }
  }
 }
}


fragment cardDetails on cardType {
  id
  text: description
  estimate
  state
}

-----------------------------------------------------------
