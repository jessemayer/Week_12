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
            url: this.url + `/${lake.id}`,
            dataType: 'json',
            data: JSON.stringify(lake),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteRamp (id){
        return $.ajax({
            url: this.url + `/${id}`,
            type: "DELETE"
        });
    }
}



class DOMManager {
    static lakes;

    static getAllLakes(){
        LakeService.getAllLakes().then(lakes => this.render(lakes));
    }

    static createLake(name) {
        LakeService.createLake(new Lake(name))
        .then (() => {
            return LakeService.getAllLakes();
        })
        .then((lakes) => this.render(lakes))
    }

    static deleteRamp(id) {
        LakeService.deleteRamp(id)
        .then(()=> {
            return LakeService.getAllLakes();
        })
        .then((lakes) => this.render(lakes));
    }

    // 
    static addLake(id) {
        
        for (let lake of this.lakes) {
            if(lake.id == id) {
                lake.boatRamps.push(new BoatRamp($(`#${lake.id}-boatRamp-name`).val(), $(`#${lake.id}-boatRamp-location`).val()));
                LakeService.updateLake(lake)
                .then(() => {
                    return LakeService.getAllLakes();
                })
                .then((lakes) => this.render(lakes));
            }
        }
    }

    static deleteLake(lakeId, boatRampId) {
        for (let lake of this.lakes) {
            if (lake.id == lakeId) {
                for (let boatRamp of lake.boatRamps){
                    if( boatRamp.id == boatRampId){
                        lake.boatRamps.splice(lake.boatRamps.indexOf(boatRamp), 1);
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


    static render(lakes) {
        this.lakes = lakes;
        $('#app').empty();
        for(let lake of lakes) {
            $('#app').prepend(
                `    <div id="${lake.id}" class = "card">
                <div class="card-header">
                    <h2>${lake.name}</h2>
                    <button class="btn btn-danger" onclick= "DOMManager.deleteRamp('${lake.id}')">delete</button>
                    
                        <div class="card-body">
                            <div class="card">
                                <div class="row">
                                <div class="col-sm">
                                    <input type= "text" id="${lake.id}-boatRamp-name" class="form-control" placeholder="Boat Ramp Name">
                                </div>
                            
                                <div class = "col-sm">
                                <input type= "text" id="${lake.id}-boatRamp-location" class="form-control" placeholder="Boat Ramp location">
                                </div>
                                </div>
                                <button id ="${lake.id}-new-boatRamp"-new-boatRamp" onclick="DOMManager.addLake('${lake.id}')" class="btn btn-primary form-control">Add Boat Ramp</button>
                        
                            </div>
                        </div>
                </div>
            </div>
             <br>
                `
            );
        for (let boatRamp of lake.boatRamps) {
            $(`#${lake.id}`).find('.card-body').append(
                `<p>
                <span id="name-${boatRamp.id}"><strong>Name: </strong> ${boatRamp.name}</span>
                <span id="location-${boatRamp.id}"><strong>Name: </strong> ${boatRamp.location}</span>
                <button class="btn btn-danger" onclick="DOMManager.deleteLake(${lake.id}, ${boatRamp.id})">Delete Lake</button>
                </p>`
                );
                }


            






        }
    }
}

$('#create-New-Lake').on('click',() => {
    DOMManager.createLake($('#new-Lake-Name').val());
    $('#new-Lake-Name').val('')
});

DOMManager.getAllLakes();