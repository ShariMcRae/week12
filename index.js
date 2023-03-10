// The application will allow users to Create, Read,
// Update and Delete (CRUD) family member records from a database
// using AJAX calls to an API created with https://mockapi.io/.

// Family member class representing one record.
class FamilyMember {
  
  constructor(firstName, lastName, age, relationship, id) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.relationship = relationship;
    this.id = id;
  }
}

// Service class containing methods that use AJAX (fetch) calls
// to Create, Read, Update and Delete family members
// from a mock API (https://mockapi.io/).
class FamilyMemberService {

  // The URL for the mock API (https://mockapi.io/).
  static url = "https://6404b7673bdc59fa8f3fe0dc.mockapi.io/api/v1/familyMembers";

  // READ all family member records.
  static async getAllFamilyMembers() {

    const response = await fetch(
      this.url, 
      {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
    return await response.json();
  }

  // This call is never used, but it
  // READS an individual family member record.
  static async getFamilyMember(id) {

    const response = await fetch(
      this.url + `/${id}`, 
      {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
    return await response.json();
  }

  // CREATE a new family member record.
  static async createFamilyMember(familyMember) {

    const response = await fetch(
      this.url, 
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(familyMember),
      });
    return await response.json();
  }

  // UPDATE an existing family member record.
  static async updateFamilyMember(familyMember) {

    const response = await fetch(
      this.url + `/${familyMember.id}`, 
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(familyMember),
      });
    return await response.json();
  }

  // DELETE an existing family member record.
  static async deleteFamilyMember(id) {

    const response = await fetch(
      this.url + `/${id}`, 
      {
        method: 'DELETE',
        headers: { "Content-Type": "application/json" },
      });
    return await response.json();
  }

} // end of FamilyMemberService class

// Class that uses the FamilyMemberService to update the database
// and then updates the DOM to reflect the changes.
class DOMManager {

  // READ all family member records and
  // render them on the page.
  static getAllFamilyMembers() {

    FamilyMemberService.getAllFamilyMembers()
      .then((familyMembers) => this.render(familyMembers));
  }

  // CREATE a new family member record using the 
  // provided FamilyMember object, and refresh the page.
  static createFamilyMember(familyMember) {

    FamilyMemberService.createFamilyMember(familyMember)
      .then((data) => {
        console.log("Created family member: " + JSON.stringify(data));
        this.getAllFamilyMembers()
      });
  }

  // UPDATE a family member record using the 
  // provided FamilyMember object, and refresh the page.
  static updateFamilyMember(familyMember) {

    FamilyMemberService.updateFamilyMember(familyMember)
      .then((data) => {
        console.log("Updated family member: " + JSON.stringify(data));
        this.getAllFamilyMembers()
      });
  }

  // DELETE the family member record with the 
  // provided id and refresh the page.
  static deleteFamilyMember(id) {

    FamilyMemberService.deleteFamilyMember(id)
    .then((data) => {
      console.log("Deleted family member: " + JSON.stringify(data));
      this.getAllFamilyMembers()
    });
  }

  // Initialize a FamilyMember object from the input fields of
  // the modal dialog box and pass the object into methods
  // for creating or updating records depending on whether the
  // id is zero. Then close the modal dialog box.
  static save() {

    let familyMember = new FamilyMember(
      $(`#firstName`).val(),
      $(`#lastName`).val(),
      $(`#age`).val(),
      $(`#relationship`).val(),
      $("#id").val()
    );

    if ($("#id").val() === "0") this.createFamilyMember(familyMember);
    else this.updateFamilyMember(familyMember);
    myModal.hide();
  }

  // Empty the tbody element and refill it with family members from the
  // provided array of FamilyMember objects. Embed the familyMember id in the
  // id of each td element, so we can reference their content by id. 
  // Set onclick events for Delete and Edit buttons on each row, passing
  // the family member id into the DOMManager methods for deleting and editing rows.
  static render(familyMembers) {
    
    $("tbody").empty();
    for (let familyMember of familyMembers) {
      $("tbody").prepend(
        `<tr>
            <td id="${familyMember.id}-firstName">${familyMember.firstName}</td>
            <td id="${familyMember.id}-lastName">${familyMember.lastName}</td>
            <td id="${familyMember.id}-age">${familyMember.age}</td>
            <td id="${familyMember.id}-relationship">${familyMember.relationship}</td>    
            <td class="text-end">
              <button class="btn btn-danger btn-sm " 
                onclick="DOMManager.deleteFamilyMember('${familyMember.id}')">Delete</button>
              <button class="btn btn-primary btn-sm " 
                onclick="DOMManager.openFamilyMemberForm('${familyMember.id}')">Edit</button>
            </td>                                                          
        </tr>`
      );
    }
  }

  // If given id is not zero, copy family member data into the 
  // modal dialog box from the row corresponding to the given id.
  // If the id is zero, initialize all fields to blank.
  // Update the title of the modal and open it.
  static openFamilyMemberForm(id) {

    if (id !== 0) {
      $("#firstName").val($(`#${id}-firstName`).html());
      $("#lastName").val($(`#${id}-lastName`).html());
      $("#age").val($(`#${id}-age`).html());
      $("#relationship").val($(`#${id}-relationship`).html());
      $("#modalTitle").html("Edit Family Member");

    } else {
      $("#firstName").val("");
      $("#lastName").val("");
      $("#age").val("");
      $("#relationship").val("");
      $("#modalTitle").html("Create Family Member");
    }

    $("#id").val(id);
    myModal.show();
  }

} // end of DOMManager class

// Display the data when the page is loaded.
DOMManager.getAllFamilyMembers();

// Create our Modal dialog object.
let myModal = new bootstrap.Modal(
                document.getElementById("editModal"), 
                { keyboard: true });
