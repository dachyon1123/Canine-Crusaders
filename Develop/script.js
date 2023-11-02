const commonDogBreedsAlphabetical = [
  'Affenpinscher',
  'Afghan Hound',
  'Airedale Terrier',
  'Akita',
  'Alaskan Malamute',
  'American Bulldog',
  'American Cocker Spaniel',
  'American Eskimo Dog',
  'American Foxhound',
  'American Pit Bull Terrier',
  'American Staffordshire Terrier',
  'American Water Spaniel',
  'Anatolian Shepherd Dog',
  'Australian Cattle Dog',
  'Australian Shepherd',
  'Australian Terrier',
  'Basenji',
  'Basset Hound',
  'Beagle',
  'Bearded Collie',
  'Bedlington Terrier',
  'Belgian Malinois',
  'Bernese Mountain Dog',
  'Bichon Frise',
  'Black and Tan Coonhound',
  'Bloodhound',
  'Border Collie',
  'Border Terrier',
  'Borzoi',
  'Boston Terrier',
  'Boxer',
  'Boykin Spaniel',
  'Brittany',
  'Brussels Griffon',
  'Bulldog',
  'Bullmastiff',
  'Cairn Terrier',
  'Cane Corso',
  'Cardigan Welsh Corgi',
  'Cavalier King Charles Spaniel',
  'Chesapeake Bay Retriever',
  'Chihuahua',
  'Chinese Crested',
  'Chinese Shar-Pei',
  'Chow Chow',
  'Clumber Spaniel',
  'Cocker Spaniel',
  'Collie',
  'Curly-Coated Retriever',
  'Dachshund',
  'Dalmatian',
  'Doberman Pinscher',
  'Dogue de Bordeaux',
  'English Bulldog',
  'English Cocker Spaniel',
  'English Setter',
  'English Springer Spaniel',
  'Flat-Coated Retriever',
  'French Bulldog',
  'German Shepherd Dog',
  'German Shorthaired Pointer',
  'Golden Retriever',
  'Gordon Setter',
  'Great Dane',
  'Great Pyrenees',
  'Greater Swiss Mountain Dog',
  'Havanese',
  'Ibizan Hound',
  'Irish Setter',
  'Irish Water Spaniel',
  'Irish Wolfhound',
  'Italian Greyhound',
  'Jack Russell Terrier',
  'Japanese Chin',
  'Keeshond',
  'Labrador Retriever',
  'Lhasa Apso',
  'Maltese',
  'Mastiff',
  'Miniature Bull Terrier',
  'Miniature Pinscher',
  'Miniature Schnauzer',
  'Neapolitan Mastiff',
  'Newfoundland',
  'Norfolk Terrier',
  'Norwegian Buhund',
  'Norwegian Elkhound',
  'Norwich Terrier',
  'Nova Scotia Duck Tolling Retriever',
  'Old English Sheepdog',
  'Papillon',
  'Pekingese',
  'Pembroke Welsh Corgi',
  'Pit Bull Terrier',
  'Pointer',
  'Pomeranian',
  'Poodle',
  'Portuguese Water Dog',
  'Pug',
  'Puli',
  'Rhodesian Ridgeback',
  'Rottweiler',
  'Saint Bernard',
  'Saluki',
  'Samoyed',
  'Schipperke',
  'Scottish Deerhound',
  'Scottish Terrier',
  'Shetland Sheepdog',
  'Shiba Inu',
  'Shih Tzu',
  'Siberian Husky',
  'Silky Terrier',
  'Skye Terrier',
  'Staffordshire Bull Terrier',
  'Standard Schnauzer',
  'Sussex Spaniel',
  'Tibetan Mastiff',
  'Tibetan Spaniel',
  'Tibetan Terrier',
  'Toy Fox Terrier',
  'Vizsla',
  'Weimaraner',
  'Welsh Terrier',
  'West Highland White Terrier',
  'Whippet',
  'Wire Fox Terrier',
  'Yorkshire Terrier',
];

let dogModal = $('#modal')
let ninjaApiInfo1 = $('.ninja-api-information1')
let ninjaApiInfo2 = $('.ninja-api-information2')
let modalCloseButton = $('.close-modal')

$(function() {
  let currentDate = new Date();
  let currentDateFormatted = dayjs(currentDate).format('YYYY-MM-DD')
  $('#start').attr('max', currentDateFormatted)
  $('#start').attr('value', currentDateFormatted)
})


$(function() {
  commonDogBreedsAlphabetical.forEach(breed => {
    let breedList = $('#breed');
    let newOption = $('<option>');
    newOption.text(breed).attr('value', breed);
    
    breedList.append(newOption)
  })
})

//Adds functionality to the filter
$('.dog-form').on('submit', (event) => {
  event.preventDefault()

  $('.dog-cards').text('')

  let dogBreed = $('#breed').val();
  let dogSize = $('#size').val();
  let dogAge = $('#age').val();
  let dogGender = $('#gender').val();

  let dateString = $('#start').val();
  let date = new Date(dateString)
  let isoString = date.toISOString();

  fetchDogs(dogSize, dogAge, dogGender, dogBreed, isoString)
})


//Fetches the token that is required for the api call
async function fetchToken() {
  const url = 'https://api.petfinder.com/v2/oauth2/token';
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', 'mU30JwOsjFnaW6kDyLIZbU944L4ibtzuYzDYY9a2ahgIrqXE13');
  params.append('client_secret', 'XxZh8h5wx3baDaYym4AnbuH3FpPBCvfmEDhNO4Eu');

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })
  let data = await res.json();
  return data['access_token']
}



//Calls the petfinder api to give a list of dogs up for adoption
async function fetchDogs (size, age, gender, breed, date) {
  let token = await fetchToken();

  size = size || '';
  age = age || '';
  gender = gender || '';
  breed = breed || '';
  date = date || '';
  
  let url = `https://api.petfinder.com/v2/animals?type=dog&limit=100&size=${size}&age=${age}&gender=${gender}&breed=${breed}&before=${date}`

  let res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  let data = await res.json()
  createDogCards(data)
}

fetchDogs();


//Creates the dog cards to the page and adds a modal for each one
function createDogCards(dogs) {
  let dogArray = dogs.animals
  console.log(dogArray)
  
  
  for (let i = 0; i<dogArray.length; ++i) {
    let dogCardDiv = $('.dog-cards');
    

    if (dogArray[i].photos.length === 0) {
      continue
    }

    let dogCard = $('<div>');
    dogCard.addClass('dog-card flex flex-col justify-center h-80 w-80')

    let dogImageDiv = $('<div>').addClass('h-full overflow-hidden rounded-xl mr-2 ml-2')
    
    let dogImage = $('<img>')
    dogImage.attr('src', dogArray[i].photos[0].full)
    dogImage.addClass('h-full w-full')
  

    dogCard.append(dogImageDiv)
    dogImageDiv.append(dogImage)
    dogCardDiv.append(dogCard)

    dogCard.on('click', function() {
      $('.main-container').removeClass('flex').addClass('hidden')
      $('.footer').addClass('hidden');
      $('.header').addClass('hidden');
      $('body').addClass('bg-sky-100')
      let dogModalName = $('.dog-name');
      let dogModalImage = $('.dog-image')
      let dogModalDescription = $('.dog-description');
      let dogBreed = $('.dog-breed-info');
      let dogAge = $('.dog-age-info');
      let email = $('.dog-email-info');
      let phone = $('.dog-phone-info');
      let dateAdded = $('.dateAdded');
      ninjaApiInfo1.text('')
      ninjaApiInfo2.text('')

      dogModalName.text(dogArray[i].name)
      dogModalDescription.text(dogArray[i].description)

      dogBreed.text('').append(`${dogArray[i].breeds.primary}`)
      dogAge.text('').append(`${dogArray[i].age}`)
      email.text('').append(`${dogArray[i].contact.email}`)
      phone.text('').append(`${dogArray[i].contact.phone}`)
      dateAdded.text('').append(` Published on ${dayjs(dogArray[i].published_at).format('MM/DD/YYYY')}`)


      
      dogModalImage.attr('src', dogArray[i].photos[0].full)
      dogModalImage.addClass('')
      

      fetchDogInformation(dogArray[i].breeds.primary)
      
      dogModal.show();
    })
  }  
}

//Closes modal when X button is pressed in top right of modal
modalCloseButton.on('click', function() {
  dogModal.hide();
  $('.main-container').removeClass('hidden').addClass('flex')
  $('.footer').removeClassClass('hidden');
  $('.header').removeClass('hidden');
  $('body').removeClass('bg-sky-100')
})

//Closes modal when esc is pressed
$(document).keydown(function(event) {
  if (event.which == 27) {
      dogModal.hide(); 
      $('.main-container').removeClass('hidden').addClass('flex')
      $('.footer').removeClass('hidden');
      $('.header').removeClass('hidden');
      $('body').removeClass('bg-sky-100')
  } 
});



async function fetchDogInformation(name) {
  try {
      const response = await fetch('https://api.api-ninjas.com/v1/dogs?name=' + encodeURIComponent(name), {
          method: 'GET',
          headers: {
              'X-Api-Key': 'gbWmZrUovo5MdfRw15NJFA==ZZxzVph1f8g2nr87',
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const result = await response.json();
      dogNinjaApiName(result);
      console.log(result)
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      noInformationFound()
  }
}




function dogNinjaApiName (dogs) {
  
  let dogBarkingLevel = $('<p>');
  dogBarkingLevel.text(`Barking Level: ${dogs[0].barking}`)

  let dogEnergyLevel =  $('<p>');
  dogEnergyLevel.text(`Energy Level: ${dogs[0].energy}`)

  let dogPlayfulness = $('<p>')
  dogPlayfulness.text(`Playfulness: ${dogs[0].playfulness}`)

  let goodWithStrangers = $('<p>')
  goodWithStrangers.text(`Good w/ Strangers: ${dogs[0].good_with_strangers}`)
  
  let goodWithDogs = $('<p>')
  goodWithDogs.text(`Good w/ Dogs: ${dogs[0].good_with_other_dogs}`)

  let goodWithChildren = $('<p>')
  goodWithChildren.text(`Good w/ Children: ${dogs[0].good_with_children}`)
  
  ninjaApiInfo1.append(dogBarkingLevel)
  ninjaApiInfo1.append(dogEnergyLevel)
  ninjaApiInfo1.append(dogPlayfulness)

  ninjaApiInfo2.append(goodWithStrangers)
  ninjaApiInfo2.append(goodWithDogs)
  ninjaApiInfo2.append(goodWithChildren)
}

function noInformationFound() {
  let dogBarkingLevel = $('<p>');
  dogBarkingLevel.text(`Barking Level: N/A`)

  let dogEnergyLevel =  $('<p>');
  dogEnergyLevel.text(`Energy Level: N/A`)

  let dogPlayfulness = $('<p>')
  dogPlayfulness.text(`Playfulness: N/A`)

  let goodWithStrangers = $('<p>')
  goodWithStrangers.text(`Good w/ Strangers: N/A`)
  
  let goodWithDogs = $('<p>')
  goodWithDogs.text(`Good w/ Dogs: N/A`)

  let goodWithChildren = $('<p>')
  goodWithChildren.text(`Good w/ Children: N/A`)
  
  ninjaApiInfo1.append(dogBarkingLevel)
  ninjaApiInfo1.append(dogEnergyLevel)
  ninjaApiInfo1.append(dogPlayfulness)

  ninjaApiInfo2.append(goodWithStrangers)
  ninjaApiInfo2.append(goodWithDogs)
  ninjaApiInfo2.append(goodWithChildren)
}

// The JS below is responsible for creating custom select boxes (dropdowns) with options. 
//It converts regular <select> elements into styled custom selects, allowing users to click on
// a trigger element to open a dropdown-like menu and select options.


// Get all elements with the "custom-select" class
const customSelects = document.querySelectorAll(".custom-select");

// Loop through each custom select element
customSelects.forEach(customSelect => {
    // Find the trigger (the part users click to open the options)
    const selectTrigger = customSelect.querySelector(".select-trigger");
    // Find the options (the list of selectable items)
    const selectOptions = customSelect.querySelector(".select-options");
    // Find all option elements within the custom select
    const selectOptionElements = customSelect.querySelectorAll(".select-option");

    // Add a click event listener to the trigger
    selectTrigger.addEventListener("click", function () {
        selectOptions.style.display = selectOptions.style.display === "block" ? "none" : "block";
    });

    selectOptionElements.forEach(option => {
        option.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevent the click event from propagating to the parent trigger
            // Update the trigger text with the selected option text
            const selectedText = this.textContent;
            selectTrigger.textContent = selectedText;
            // Hide the options
            selectOptions.style.display = "none";
        });
    });

    // Close the options when clicking outside
    document.addEventListener("click", function (e) {
        if (e.target !== selectTrigger) {
            selectOptions.style.display = "none";
        }
    });
});




