class Lake{
    constructor(name) {
        this.name = name;
        this.boatRamps = [];
    }

    addLake(name, location) {
        this.boatRamps.push(new BoatRamp(name, location));
    }
}
class BoatRamp {
    constructor(name, location){
    this.name =name;
    this.location = location;
    }
}

class LakeService {
    static url = 'https://63baea0a56043ab3c7a853f5.mockapi.io/boat_ramp_API/ramps';

    static getAllLakes() {
        return $.get(this.url);
    }

    static getLake(id) {
        return $.get(this.url + `/${id}`);
    }

    static createLake(lake) {
        return $.post(this.url, lake);
    }

    static updateLake(lake) {
        return $.ajax({
            url: this.url + `/${lake._id}`,
            dataType: 'json',
            data: JSON.stringify(lake),
            contentType: 'application/json',
            type: 'PUT'
        });
    }
    static updateBoatRamp(lake, ramp) {
        return $.ajax({
            url: this.url + `/${lake._id}`,
            dataType: 'json',
            data: JSON.stringify(lake),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteLake (id){
        return $.ajax({
            url: this.url + `/${id}`,
            type: "DELETE"
        });
    }
}



class DOMManager {
    static lakes;
    static boatRampName;
    
    static getAllLakes(){
        LakeService.getAllLakes().then(lakes => this.render(lakes));
    }

    static render(lakes) {
        this.lakes = lakes;
        $('#app').empty();
        for(let lake of lakes) {
            $('#app').prepend(
                `<div id="${lake._id}" class = "card">
                    <div class="card-header">
                        <h2>${lake.name}</h2>
                        <button class="btn btn-danger" onclick= "DOMManager.deleteLake('${lake._id}')">delete</button>
                        </div>
                            <div class="card-body">
                                <div class="card"
                                    <div class="row">
                                    <div class="col-sm">
                                        <input type= "text" id="${lake._id}-boatRamp-name" class="form-control" placeholder="Boat Ramp Name">
                                    </div>
                                
                                    <div class = "col-sm">
                                    <input type= "text" id="${lake._id}-boatRamp-location" class="form-control" placeholder="Boat Ramp location">
                                    </div>
                                    </div>
                                    <button id ="${lake._id}-new-boatRamp"-new-boatRamp" onclick="LakeService.updateBoatRamp('${lake._id}')" class="btn btn-primary form-control">Add Boat Ramp</button>
                                </div>
                            </div>
                 </div>
                 <br>
                `
            );


            for (let boatRamp of lake.boatRamps) {
                $(`#${lake._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${boatRamp._id}"><strong>Name: </strong> ${boatRamp.name}</span>
                    <span id="location-${boatRamp._id}"><strong>Name: </strong> ${boatRamp.location}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteLake('${lake._id}', '${boatRamp._id}')">Delete Lake</button>
                    </p>
                    `
                )
                };


            






        }
    }
}

DOMManager.getAllLakes();