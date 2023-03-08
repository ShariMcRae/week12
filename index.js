// The application will allow users to Create, Read,
// Update and Delete (CRUD) family member records from a database
// using AJAX calls to an API created with https://mockapi.io/.

// Family member class representing one record.
class FamilyMember {
  constructor(firstName, lastName, age, relationship) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.relationship = relationship;
  }
}

// Service class containing methods that use AJAX calls
// to Create, Read, Update and Delete family members
// from a mock API (https://mockapi.io/).
class FamilyMemberService {
    
  // The URL for the mock API (https://mockapi.io/).
  static url =
    "https://6404b7673bdc59fa8f3fe0dc.mockapi.io/api/v1/familyMembers";

  // Read (retrieve) all family members.
  static getAllFamilyMembers() {
    return $.get(this.url);
  }

  // This call is never used, but
  // gets an individual family member record.
  static getFamilyMember(id) {
    return $.get(this.url + `/${id}`);
  }

  // Create a new family member record
  // by posting an object to the API.
  static createFamilyMember(familyMember) {
    return $.post(this.url, familyMember);
  }

  // Update an existing family member record.
  static updateFamilyMember(familyMember, id) {
    return $.ajax({
      url: this.url + `/${id}`,
      dataType: "json",
      data: JSON.stringify(familyMember),
      contentType: "application/json",
      type: "PUT",
    });
  }

  // Delete an existing family member record.
  static deleteFamilyMember(id) {
    return $.ajax({
      url: this.url + `/${id}`,
      type: "DELETE",
    });
  }
}

// Class to manage the presentation of the data on the page.
class DOMManager {

  static getAllFamilyMembers() {
    FamilyMemberService.getAllFamilyMembers().then((familyMembers) =>
      this.render(familyMembers)
    );
  }

  static createFamilyMember(familyMember) {
    FamilyMemberService.createFamilyMember(familyMember)
      .then(() => {
        return FamilyMemberService.getAllFamilyMembers();
      })
      .then((familyMembers) => this.render(familyMembers));
  }

  static updateFamilyMember(familyMember, id) {
    FamilyMemberService.updateFamilyMember(familyMember, id)
    .then(() => {
      return FamilyMemberService.getAllFamilyMembers();
    })
    .then((familyMembers) => this.render(familyMembers));
  }

  static deleteFamilyMember(id) {
    FamilyMemberService.deleteFamilyMember(id)
      .then(() => {
        return FamilyMemberService.getAllFamilyMembers();
      })
      .then((familyMembers) => this.render(familyMembers));
  }

  static save() {
    let familyMember = new FamilyMember(
      $(`#firstName`).val(),
      $(`#lastName`).val(),
      $(`#age`).val(),
      $(`#relationship`).val()
    );

    let id = $('#id').val();
    if (id === "0") this.createFamilyMember(familyMember);
    else this.updateFamilyMember(familyMember, id);
    myModal.hide();
  }

  static render(familyMembers) {
    this.familyMembers = familyMembers;
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

  static openFamilyMemberForm(id) {

    // move data from row into the modal
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
}

// Display the data when the page is loaded.
DOMManager.getAllFamilyMembers();

// Create our Modal dialog object.
let myModal = new bootstrap.Modal(document.getElementById("editModal"), {
  keyboard: true,
});
