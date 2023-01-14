// Created a class called lake with a constructor of name and boatRamps that takes in a empty array
class Lake {
    constructor(name) {
      this.name = name;
      this.boatRamps = [];
    }
  // created a method that creates a new boat ramp with a name and location
  
    addLake(name, location) {
      this.boatRamps.push(new BoatRamp(name, location));
    }
  }
  
  // created a class object called boatRamp that takes 2 constructors name and location
  class BoatRamp {
    constructor(name, location) {
      this.name = name;
      this.location = location;
    }
  }
  // created a lakeService object to call on the CRUD operations and the url.
  class LakeService {
  //   url of the api
      static url =
      "https://63baea0a56043ab3c7a853f5.mockapi.io/boat_ramp_API/ramps";
  // this method is getting all the info from the api. it is part of the Read portion of CRUD
    static getAllLakes() {
      return $.get(this.url);
    }
  // this method is similar to the getAllLakes method with it concatenating the the ID so you can access a specific lake. It is also part of the Read portion of CRUD.
    static getLake(id) {
      return $.get(this.url + `/${id}`);
    }
  // this method is the Create part of the CRUD operation. it is creating a new lake on the api with a jquery post request 
    static createLake(lake) {
      return $.post(this.url, lake);
    }
  // this is the Update method of our lake services and the Update portion of the CRUD. update lake takes the lake as a parameter and returns a ajax request. 
    static updateLake(lake) {
      console.log('this is the lake', lake);
      return $.ajax({
          // in this ajax call it is we are concatenating the api with the lake and the id. 
          //  what this does is it is say this lake with this id we are updating 
        url: this.url + `/${lake.id}`,
          // the rest of this call declares that it is a json, that lake need to be made into a string to work with json and that it is a put request to update the lake object.  
        dataType: "json",
        data: JSON.stringify(lake),
        contentType: "application/json",
        type: "PUT",
      });
    }
  // this is the Delete portion of the CRUD. it takes a ajax call to the api and concatenate with the ID and to delete.
  // what it is saying is in the api array delete this id, so delete this lake or this boat ramp
    static deleteRamp(id) {
      return $.ajax({
        url: this.url + `/${id}`,
        type: "DELETE",
      });
    }
  }
  
  // this object is the dom manager for manipulating the dom. what is happening in this object is every time a method is called in the lake manager it is also being called in the domManager
  // so that it can re render the dom to display the changes being made to the api 
  class DOMManager {
      // create a variable called lakes to represent all the lakes in this class
    static lakes;
  // this method makes a call to the getallLakes method in lake services object. It then says to make a promise with the .then()to pull all lakes 
  // when the promise is resolved do the render(lakes) method in this object to makes changes to the dom 
    static getAllLakes() {
      LakeService.getAllLakes().then((lakes) => this.render(lakes));
    }
  // create lake method has one parameter on name that says when a new lake is created it takes a promise to to return the getAllLake method and to render the dom method with the parameter of lake
    static createLake(name) {
      LakeService.createLake(new Lake(name))
        .then(() => {
          return LakeService.getAllLakes();
        })
        .then((lakes) => this.render(lakes));
    }
  // this method takes one parameter of id and using dot notation saying that when LakeService.deleteRamp of this id.
  //  we create a promise to return the getAllLakes method in lakeService and to render the changes it to the dom.
    static deleteRamp(id) {
      LakeService.deleteRamp(id)
        .then(() => {
          return LakeService.getAllLakes();
        })
        .then((lakes) => this.render(lakes));
    }
  
    //when add lake is called with an id this method then uses a instance of loop to loop through the lake of this.lakes array
    static addLake(id) {
      for (let lake of this.lakes) {
  // then if the lake id equals the id, it pushes a new BoatRamp object to the lake.boatRamps array. 
  // It then calls the updateLake(lake) method of the LakeService class, passing in the current lake object as an argument.
        if (lake.id == id) {
          lake.boatRamps.push(
            new BoatRamp(
              // this then pushes a boat ramp name and location input to the dom
              $(`#${lake.id}-boatRamp-name`).val(),
              $(`#${lake.id}-boatRamp-location`).val()
            )
          );
  
          // this also calls on the updateLake in lakeService to update the api with the boatRamp name and location
          LakeService.updateLake(lake)
          // when the promise is resolved we return the getallLakes method and render the lakes changes to the dom 
            .then(() => {
              return LakeService.getAllLakes();
            })
            .then((lakes) => this.render(lakes));
        }
      }
    }
  // creates a method to take 2 parameters lake id and the boatRampId
    static deleteLake(lakeId, boatRampId) {
      // it then uses a for of loop to iterate over the this.lakes array
      for (let lake of this.lakes) {
          // if lake.id == lakeID when looping execute the nested loop
        if (lake.id == lakeId) {
          // it then uses a for of loop to iterate over the lake.boatRamps array of the current lake
          for (let boatRamp of lake.boatRamps) {
              // It then uses another if statement to check if the id of the current boatRamp object equals the boatRampId
            if (boatRamp.id == boatRampId) {
              // if the statment is true then It uses the splice() method to remove the current boatRamp object from the lake.boatRamps array.
              lake.boatRamps.splice(lake.boatRamps.indexOf(boatRamp), 1);
              // This method then updates the lake on the server with the new boat ramps information after the specific boat ramp is deleted.
              LakeService.updateLake(lake)
                .then(() => {
                  return LakeService.getAllLakes();
                })
                .then((lakes) => this.render(lakes));
            }
          }
        }
      }
    }
  // this method is where the dom is being manipulated to display the changes made by CRUD
    static render(lakes) {
      this.lakes = lakes;
      // this line clears the app 
      $("#app").empty();
      // for of loop to iterate through the lake of lakes
      for (let lake of lakes) {
          // this is where the bulk of dom Manipulation is being done in the app section of our html.
        $("#app").prepend(
          `
            <div id="${lake.id}" class="card">
              <div class="card-header">
                <h2>${lake.name}</h2>
                <button
                  class="btn btn-danger"
                  onclick="DOMManager.deleteRamp('${lake.id}')"
                >
                  delete
                </button>
  
                <div class="card-body">
                  <div class="card">
                    <div class="row">
                      <div class="col-sm">
                        <input
                          type="text"
                          id="${lake.id}-boatRamp-name"
                          class="form-control"
                          placeholder="Boat Ramp Name"
                        />
                      </div>
  
                      <div class="col-sm">
                        <input
                          type="text"
                          id="${lake.id}-boatRamp-location"
                          class="form-control"
                          placeholder="Boat Ramp location"
                        />
                      </div>
                    </div>
                    <button
                      id="${lake.id}-new-boatRamp"
                      onclick="DOMManager.addLake('${lake.id}')"
                      class="btn btn-primary form-control"
                    >
                      Add Boat Ramp
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <br />
          `
        );
      //   this nested loop is where the boatRamp is being iterated through the boatRamps array on each iteration it accesses the current boatRamp
        for (let boatRamp of lake.boatRamps) {
          // It then uses jQuery to select the HTML element with the id of the current lake object, lake.id. 
          // It then finds its child element with the class of card-body and appends new HTML content to it.
          $(`#${lake.id}`)
            .find(".card-body")
            .append(
              `<p>
                  <span id="name-${boatRamp.id}"><strong>Boat Ramp Name: </strong> ${boatRamp.name}</span>
                  <span id="location-${boatRamp.id}"><strong>Boat Ramp Location: </strong> ${boatRamp.location}</span>
                  <button class="btn btn-danger" onclick="DOMManager.deleteLake(${lake.id}, ${boatRamp.id})">Delete Lake</button>
                  </p>`
            );
        }
      }
    }
  }
  //  when the id of create-new-lake has been clicked it calls the create Lake method passing in the value in the element of the new lake name and clears the input field of the new-lake-name.
  $("#create-New-Lake").on("click", () => {
    DOMManager.createLake($("#new-Lake-Name").val());
    $("#new-Lake-Name").val("");
  });
  // calls DOMManager to get all lakes to start the crud ap
  DOMManager.getAllLakes();
  
