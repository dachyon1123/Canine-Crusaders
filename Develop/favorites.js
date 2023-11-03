    async function fetchFavorites () {
    let token = await fetchToken();
  
    let favoritesString = favoritesArray.toString()
    console.log(favoritesArray)
    
    let url = `https://api.petfinder.com/v2/animals?type=dog&limit=100&id=`
  
    let res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    let data = await res.json()
    createDogCards(data)
  }
  
  $('.favorites-page').on('click', function() {
    fetchFavorites();
  })