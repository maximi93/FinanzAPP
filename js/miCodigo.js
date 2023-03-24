window.addEventListener("load", function () {
  console.log("START!");
  let cajeros;
  let map;
  let userMovements = [
    {
      descripcion: "asdkajhdk jahmovimientooo 2",
      importe: 234,
      rubro: 6,
      medio: " Tarjeta Crédito",
      fecha: "22/03/2023",
    },
    {
      descripcion: "gasto F xd",
      importe: 2234,
      rubro: 1,
      medio: "Tarjeta Débito",
      fecha: "23/03/2023",
    },
    {
      descripcion: "asdasaaaaaaaaaa PAGOOOO 2",
      importe: 50400,
      rubro: 8,
      medio: "Banco",
      fecha: "26/03/2023",
    },
  ];
  class Usuario {
    constructor(usuario, password, idDepartamento, idCiudad) {
      this.usuario = usuario;
      this.password = password;
      this.idDepartamento = idDepartamento;
      this.idCiudad = idCiudad;
    }
  }

  class Movimiento {
    constructor(idUsuario, concepto, categoria, total, medio, fecha) {
      this.idUsuario = idUsuario;
      this.concepto = concepto;
      this.categoria = categoria;
      this.total = total;
      this.medio = medio;
      this.fecha = fecha;
    }
  }
  const LS_STRING_LOGGED_USER = "isLoggedUser";
  const LS_STRING_USER_TOKEN = "userToken";
  const LS_STRING_USER_ID = "userId";
  const LS_STRING_RUBROS_LIST = "rubrosList";
  const LS_STRING_UBICATION = "userUbication";

  const env = {
    apiURL: "https://dwallet.develotion.com",
  };
  const nav = document.querySelector("ion-nav");
  const menu = document.querySelector("#menu");

  const modals = {
    modalIngreso: document.querySelector("#ingresoModal"),
    modalGasto: document.querySelector("#gastoModal"),
  };
  const screens = {
    login: document.querySelector("#loginScreen"),
    registration: document.querySelector("#registrationScreen"),
    home: document.querySelector("#homeScreen"),
    map: document.querySelector("#mapScreen"),
  };
  const menuOptions = {
    login: document.querySelector("#loginMenuBtn"),
    registration: document.querySelector("#registerMenuBtn"),
    home: document.querySelector("#homeMenuBtn"),
    logout: document.querySelector("#logoutMenuBtn"),
    map: document.querySelector("#mapMenuBtn"),
  };
  const registrationElem = {
    inputUser: document.querySelector("#registrationScreen #nUser"),
    inputDpto: document.querySelector("#registrationScreen #nDepartamento"),
    inputCity: document.querySelector("#registrationScreen #nCiudad"),
    inputPassword: document.querySelector("#registrationScreen #nPassword"),
    inputPasswordVerif: document.querySelector(
      "#registrationScreen #nPasswordVerif"
    ),
    submitBtn: document.querySelector("#registrationScreen #registrationBtn"),
  };
  const loginElem = {
    inputUser: document.querySelector("#loginScreen #loginUser"),
    inputPassword: document.querySelector("#loginScreen #loginPassword"),
    submitBtn: document.querySelector("#loginScreen #loginBtn"),
  };
  const loadingElems = {
    homeLoading: document.querySelector("#homeScreen div.loading"),
    mapLoading: document.querySelector("#mapScreen div.loading"),
  };
  const homeElem = {
    newMovementBtn: document.querySelector("#homeScreen #newMovement"),
    movementPopup: document.querySelector("#homeScreen #movementPopup"),
    listAllMovements: document.querySelector("#homeScreen #allMovements"),
    listIncomeMovements: document.querySelector("#homeScreen #incomeMovements"),
    listExpensesMovements: document.querySelector(
      "#homeScreen #expensesMovements"
    ),
    segmentAll: document.querySelector("#homeScreen #segmentAll"),
    segmentExpenses: document.querySelector("#homeScreen #segmentExpenses"),
    segmentIncome: document.querySelector("#homeScreen #segmentIncome"),
    totalIncome: document.querySelector("#homeScreen #totalIncome"),
    totalExpenses: document.querySelector("#homeScreen #totalExpenses"),
    totalAvailable: document.querySelector("#homeScreen #totalAvailable"),
  };

  const gastoElems = {
    inputConcepto: document.querySelector("#homeScreen #conceptoGasto"),
    inputRubro: document.querySelector("#homeScreen #rubroGasto"),
    inputMedio: document.querySelector("#homeScreen #medioGasto"),
    inputImporte: document.querySelector("#homeScreen #importeGasto"),
    inputFecha: document.querySelector("#homeScreen #datetimeGasto"),
    registrarGastoBtn: document.querySelector("#homeScreen #registrarGasto"),
    cancelBtn: document.querySelector("#homeScreen #cancelGasto"),
  };
  const ingresoElems = {
    inputConcepto: document.querySelector("#homeScreen #conceptoIngreso"),
    inputRubro: document.querySelector("#homeScreen #rubroIngreso"),
    inputMedio: document.querySelector("#homeScreen #medioIngreso"),
    inputImporte: document.querySelector("#homeScreen #importeIngreso"),
    inputFecha: document.querySelector("#homeScreen #datetimeIngreso"),
    registrarIngresoBtn: document.querySelector(
      "#homeScreen #registrarIngreso"
    ),
    cancelBtn: document.querySelector("#homeScreen #cancelIngreso"),
  };

  const shareBtn = document.querySelector("#menu #shareBtnContainer #shareBtn")

  // LS
  const saveInLocalStorage = (keyParam, valueParam) => {
    localStorage.setItem(keyParam, valueParam);
  };

  const getFromLocalStorage = (keyParam) => localStorage.getItem(keyParam);

  const presentToast = (msgParam, positionParam, status) => {
    const toast = document.createElement("ion-toast");
    toast.header = msgParam;
    toast.position = positionParam;
    toast.color = status;
    toast.duration = 3000;
    toast.buttons = [
      {
        text: "Ok",
        role: "cancel",
        handler: () => {
          console.log("Toast Closed");
        },
      },
    ];

    document.body.appendChild(toast);
    return toast.present();
  };

  const displaySection = (sectionToDisplay) => {
    screens.login.style.display = "none";
    screens.registration.style.display = "none";
    screens.home.style.display = "none";
    screens.map.style.display = "none";
    sectionToDisplay.style.display = "";
  };

  const menuOptionsToDisplay = (optionsToDisplay) => {
    //optionsToDisplay : HTMLElement[]
    for (const elem in menuOptions) {
      menuOptions[elem].style.display = "none";
    }
    for (const option of optionsToDisplay) {
      option.style.display = "";
    }
  };

  const resetInputs = () => {
    loginElem.inputPassword.value = "";
    loginElem.inputUser.value = "";

    registrationElem.inputUser.value = "";
    registrationElem.inputCity.value = "";
    registrationElem.inputDpto.value = "";
    registrationElem.inputPassword.value = "";
    registrationElem.inputPasswordVerif.value = "";

    resetInputsMovimientos();
  };
  const resetInputsMovimientos = () => {
    ingresoElems.inputConcepto.value = "";
    // ingresoElems.inputFecha.value = new Date();
    ingresoElems.inputImporte.value = 0;
    ingresoElems.inputMedio.value = "";
    ingresoElems.inputRubro.value = "";

    gastoElems.inputConcepto.value = "";
    // gastoElems.inputFecha.value = new Date();
    gastoElems.inputImporte.value = 0;
    gastoElems.inputRubro.value = "";
    gastoElems.inputMedio.value = "";
  };

  const navigateTo = (screen) => {
    nav.push(screen);
  };

  const navegation = (event) => {
    const screen = event.detail.to;
    let msg = "";
    if (screen === "/login") {
      if (!isUserLogged()) {
        displaySection(screens.login);
        navigateTo("loginScreen");
      } else {
        msg = "Cierra sesión para iniciar con otro usuario";
        displaySection(screens.home);
        presentToast(msg, "top", "warning");
      }
    } else if (screen === "/logout") {
      if (isUserLogged()) {
        displaySection(screens.login);
      } else {
        msg = "Antes debes iniciar session!";
        displaySection(screens.login);
        // nav.popToRoot();
        presentToast(msg, "top", "warning");
      }
    } else if (screen === "/home") {
      if (isUserLogged()) {
        displaySection(screens.home);
        // hideAllLoadingScreens();
      } else {
        msg = "Antes debes iniciar session!";
        // displaySection(screens.login);
        navigateTo("loginScreen");
        // nav.popToRoot();
        presentToast(msg, "top", "warning");
      }
    } else if (screen === "/") {
      if (isUserLogged()) {
        displaySection(screens.home);
        hideAllLoadingScreens();
      } else {
        displaySection(screens.login);
      }
    } else if (screen === "/registration") {
      if (!isUserLogged()) {
        displaySection(screens.registration);
        registrationElem.inputCity.setAttribute("disabled", "true");
        loadDepartments();
      } else {
        msg = "Finaliza la sesión para registrar un nuevo usuario";
        displaySection(screens.home);
        presentToast(msg, "top", "warning");
        // hideAllLoadingScreens();
      }
    } else if (screen === "/map") {
      if (isUserLogged()) {
        displaySection(screens.map);
        if (!map) {
          initializeMap();
        }
      } else {
        msg = "Antes debes iniciar session!";
        displaySection(screens.login);
        //  nav.popToRoot();
        presentToast(msg, "top", "warning");
      }
      // } else {
      //   displaySection(screens.login);
      //   presentToast(msg, "top", "warning");
    }
  };

  const isUserLogged = () => {
    return (
      !!getFromLocalStorage(LS_STRING_LOGGED_USER) &&
      !!getFromLocalStorage(LS_STRING_USER_TOKEN)
    );
  };

  const closeModal = (modal) => {
    modal.dismiss();
  };

  const clearAppData = () => {
    if (isUserLogged) {
      localStorage.clear();
    }
    return false;
  };

  const hideAllLoadingScreens = () => {
    for (const elem in loadingElems) {
      loadingElems[elem].style.display = "none";
    }
  };

  const showLoadingScreen = (elem) => {
    elem.style.display = "";
  };

  const redirectLoginError = (errorText) => {
    navigateTo("loginScreen");
    presentToast(errorText, "top", "danger");
  };

  const loginApiReq = (user, pass) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      usuario: user,
      password: pass,
    });
    console.log(raw);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${env.apiURL}/login.php`, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.mensaje) {
          throw new Error("Datos invalidos o No existe usuario");
        }

        saveInLocalStorage(LS_STRING_LOGGED_USER, true);
        saveInLocalStorage(LS_STRING_USER_TOKEN, JSON.stringify(result.apiKey));
        saveInLocalStorage(LS_STRING_USER_ID, JSON.stringify(result.id));
        activateSession();
        presentToast(`Login success! Bienvenido/a ${user}`, "top", "success");
      })
      .catch((errorParam) => {
        presentToast(`${errorParam}`, "top", "danger");
        return false;
      });
  };
  const loginFunc = () => {
    try {
      // let usuarioEncontrado = false;
      if (isUserLogged()) {
        throw new Error("Ya hay un usuario loggeado...");
      }
      if (!loginElem.inputUser.value || !loginElem.inputPassword.value) {
        throw new Error("Ingrese todos los datos");
      }

      loginApiReq(loginElem.inputUser.value, loginElem.inputPassword.value);
    } catch (error) {
      console.log(error);
      presentToast(`${error}`, "top", "danger");
    }
    return false;
  };

  const activateSession = () => {
    try {
      if (isUserLogged()) {
        menuOptionsToDisplay([
          menuOptions.home,
          menuOptions.map,
          menuOptions.logout,
        ]);
        // displaySection(homeDiv);
        navigateTo("homeScreen");
        resetInputs();
        loadRubros();
        switchListTo(homeElem.listAllMovements);
        // getMovements();
        // setTimeout(function () {
        //   renderMovementsData(userMovements);
        // }, 1000);
        getMovements();
        // setTimeout(function () {
        //   hideAllLoadingScreens();
        // }, 1500);
        // getProducts();
        // displayProducts(products);
        return true;
      } else {
        throw new Error("Debes loggearte antes!");
      }
    } catch (errorParam) {
      console.log(errorParam);
      redirectLoginError(errorParam);
    }
  };
  const getUserToken = () =>
    JSON.parse(getFromLocalStorage(LS_STRING_USER_TOKEN));
  const getUserID = () => JSON.parse(getFromLocalStorage(LS_STRING_USER_ID));

  const logoutFunc = () => {
    if (!isUserLogged) {
      const msg = "There are no user logged in";
      presentToast(`${msg}`, "top", "warning");
      return false;
    }
    try {
      console.log("deslogueando...");
      const msg = "Has finalizado la session!";
      presentToast(`${msg}`, "top", "warning");
      clearAppData();
      // window.location.href = "./index.html"
      resetInputs();
      menuOptionsToDisplay([menuOptions.login, menuOptions.registration]);
      navigateTo("loginScreen");
      // nav.popToRoot();
      resetMap();
    } catch (error) {
      // console.log(error);
      presentToast(`${error}`, "top", "warning");

      console.log("UN ERROR: ", error);
    }
  };

  //Corrige el formato de fecha para que lo pueda recibir la API
  const parseDate = (fecha) =>
    `${fecha.getFullYear()}-${
      fecha.getMonth() + 1 < 10
        ? "0" + (fecha.getMonth() + 1)
        : fecha.getMonth() + 1
    }-${fecha.getDate() < 10 ? "0" + fecha.getDate() : fecha.getDate()}`;

  //crear objeto usuario con el valor de los inputs
  const createUser = () => {
    return new Usuario(
      registrationElem.inputUser.value,
      registrationElem.inputPassword.value,
      registrationElem.inputDpto.value,
      registrationElem.inputCity.value
    );
  };

  //crear gasto con el valor de los inputs
  const createGasto = () => {
    try {
      if (!isUserLogged()) {
        throw new Error("Antes debes loggearte!");
      }
      let gastoDate = new Date(gastoElems.inputFecha.value);
      let fechaFormateada = parseDate(gastoDate);
      console.log(fechaFormateada);
      return new Movimiento(
        getUserID(),
        gastoElems.inputConcepto.value,
        gastoElems.inputRubro.value,
        gastoElems.inputImporte.value,
        gastoElems.inputMedio.value,
        fechaFormateada
      );
    } catch (errorParam) {
      console.log(errorParam);
      redirectLoginError(errorParam);
    }
  };

  //creo el ingreso con el valor de los inputs
  const createIngreso = () => {
    try {
      if (!isUserLogged()) {
        throw new Error("Antes debes loggearte!");
      }
      let ingresoDate = new Date(ingresoElems.inputFecha.value);
      let fechaFormateada = parseDate(ingresoDate);
      console.log(fechaFormateada);
      return new Movimiento(
        getFromLocalStorage(LS_STRING_USER_ID),
        ingresoElems.inputConcepto.value,
        ingresoElems.inputRubro.value,
        ingresoElems.inputImporte.value,
        ingresoElems.inputMedio.value,
        fechaFormateada
      );
    } catch (errorParam) {
      console.log(errorParam);
      redirectLoginError(errorParam);
    }
  };
  // registro contra la API
  const registerApiReq = (user) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(user),
    };

    fetch(`${env.apiURL}/usuarios.php`, requestOptions)
      .then((resp) => resp.json())
      .then((result) => {
        console.log(result);
        //si todo da bien lo auto-loguea
        if (result.codigo == "200") loginApiReq(user.usuario, user.password);
        if (result.codigo == "409")
          presentToast(`${result.mensaje}`, "top", "danger");
      })
      .catch((error) => console.log(error));
  };

  //agrego el movimiento contra la API
  const addMovimientoApi = (movimiento) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("apikey", getUserToken());

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(movimiento),
    };

    fetch(`${env.apiURL}/movimientos.php`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.codigo == "200") {
          presentToast(`${result.mensaje}`, "top", "success");
          showLoadingScreen(loadingElems.homeLoading);

          gastoElems.registrarGastoBtn.innerHTML = `Registrar
          <ion-icon name="cash" slot="end"></ion-icon>
          <ion-ripple-effect></ion-ripple-effect>`;
          ingresoElems.registrarIngresoBtn.innerHTML = `Registrar
          <ion-icon name="cash" slot="end"></ion-icon>
          <ion-ripple-effect></ion-ripple-effect>`;
          resetInputsMovimientos();
          closeModal(modals.modalIngreso);
          closeModal(modals.modalGasto);
          homeElem.movementPopup.dismiss();

          setTimeout(() => {
            getMovements();
          }, 500);
        } else {
          presentToast(`${result.mensaje}`, "top", "danger");
        }
      })
      .catch((error) => console.log("error", error));
  };
  const registerFunc = () => {
    try {
      let user = createUser();
      validateUser(user);
      registerApiReq(user);
    } catch (error) {
      console.log(error);
      presentToast(`${error}`, "top", "danger");
    }
  };

  //creo el gasto, valido y agrego el movimiento contra la api
  const addGastoFunc = () => {
    try {
      let gasto = createGasto();
      console.log(gasto);
      validateMovimiento(gasto);
      gastoElems.registrarGastoBtn.innerHTML = `<ion-spinner name="crescent" color="secondary"></ion-spinner>`;
      addMovimientoApi(gasto);
    } catch (error) {
      console.log(error);
      presentToast(`${error}`, "top", "danger");
    }
  };

  //creo el ingreso, valido y agrego el movimiento contra la api
  const addIngresoFunc = () => {
    try {
      let ingreso = createIngreso();
      console.log(ingreso);
      validateMovimiento(ingreso);
      ingresoElems.registrarIngresoBtn.innerHTML = `<ion-spinner name="crescent" color="secondary"></ion-spinner>`;
      addMovimientoApi(ingreso);
    } catch (error) {
      console.log(error);
      presentToast(`${error}`, "top", "danger");
    }
  };

  //validar usuario que llega por parametro
  const validateUser = (user) => {
    if (!user.usuario) {
      throw new Error("El usuario no puede estar vacío");
    }
    if (!user.idDepartamento) {
      throw new Error("El departamento no puede estar vacío");
    }
    if (!user.idCiudad) {
      throw new Error("La ciudad no puede estar vacía");
    }
    if (
      !user.password ||
      user.password.trim().length < 8 ||
      user.password.trim().length > 20
    ) {
      throw new Error(
        "La contraseña es obligatorio y debe tener entre ocho y veinte caracteres"
      );
    }
    if (
      user.password.trim() != registrationElem.inputPasswordVerif.value.trim()
    ) {
      throw new Error("Las contraseñas no coinciden");
    }
  };

  // valido que los inputs no esten vacios
  const validateMovimiento = (movimiento) => {
    if (!movimiento.idUsuario) {
      throw new Error("Error al identificar al usuario");
    }
    if (!movimiento.concepto) {
      throw new Error("La descripcion no puede estar vacía");
    }
    if (!movimiento.categoria) {
      throw new Error("El rubro no puede estar vacío");
    }
    if (!movimiento.total) {
      throw new Error("El importe total no puede estar vacío");
    }
    if (!movimiento.medio) {
      throw new Error("El medio no puede estar vacío");
    }
    if (!movimiento.fecha) {
      throw new Error("La fecha no puede estar vacía");
    }
  };

  // obtener departamentos para cargar el select de registro
  const getDepartments = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${env.apiURL}/departamentos.php`, requestOptions)
      .then((response) => response.json())
      .then(function (resp) {
        let i = 0;
        let card = "";
        while (i < resp.departamentos.length) {
          card +=
            "<ion-select-option value='" +
            resp.departamentos[i].id +
            "'>" +
            resp.departamentos[i].nombre +
            "</ion-select-option>";
          i++;
        }
        registrationElem.inputDpto.innerHTML = card;
      })
      .catch((error) => console.log("error", error));
  };
  // cargo el select de departamentos
  const loadDepartments = () => {
    try {
      getDepartments();
    } catch (error) {
      console.log(error.message);
    }
  };

  // obtener ciudades para un departamento por parametro
  const getCitiesForDep = (idDep) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${env.apiURL}/ciudades.php?idDepartamento=${idDep}`, requestOptions)
      .then((response) => response.json())
      .then(function (resp) {
        let i = 0;
        let card = "";
        while (i < resp.ciudades.length) {
          card +=
            "<ion-select-option value='" +
            resp.ciudades[i].id +
            "'>" +
            resp.ciudades[i].nombre +
            "</ion-select-option>";
          i++;
        }
        registrationElem.inputCity.innerHTML = card;
      })
      .catch((error) => console.log("error", error));
  };
  // cargo el select de ciudades
  const loadCitiesForDep = (idDep) => {
    try {
      getCitiesForDep(idDep);
    } catch (error) {
      console.log(error.message);
    }
  };

  // obtener rubros para cargar select
  const getRubros = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("apikey", getUserToken());

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${env.apiURL}/rubros.php`, requestOptions)
      .then((response) => response.json())
      .then(function (resp) {
        console.log("rubros", JSON.stringify(resp.rubros));
        saveInLocalStorage(LS_STRING_RUBROS_LIST, JSON.stringify(resp.rubros));
        let i = 0;
        let card = "";
        while (i < resp.rubros.length) {
          if (resp.rubros[i].id < 7) {
            card =
              "<ion-select-option value='" +
              resp.rubros[i].id +
              "'>" +
              resp.rubros[i].nombre +
              "</ion-select-option>";
            gastoElems.inputRubro.innerHTML += card;
          } else {
            card =
              "<ion-select-option value='" +
              resp.rubros[i].id +
              "'>" +
              resp.rubros[i].nombre +
              "</ion-select-option>";
            ingresoElems.inputRubro.innerHTML += card;
          }

          i++;
        }
      })
      .catch((error) => console.log("error", error));
  };
  // cargo los rubros
  const loadRubros = () => {
    try {
      getRubros();
    } catch (error) {
      console.log(error.message);
    }
  };

  // HOME
  // funcion para verificar si el movimiento es gasto
  const isGasto = (movimiento) => movimiento.categoria < 7;
  /* const skeletonElems = (cant)=>{
  //   let skeletonResult = "";
  //   for (let i = 0; i < cant; i++) {
  //     skeletonElems += `<ion-skeleton-text animated="true" style="width: 100%;"></ion-skeleton-text>`
  //   }
  //   return skeletonResult
  // }*/

  // reinicia elementos que muestran datos
  const resetMovementsData = () => {
    homeElem.listAllMovements.innerHTML = "";
    homeElem.listExpensesMovements.innerHTML = "";
    homeElem.listIncomeMovements.innerHTML = "";
    homeElem.totalAvailable.innerHTML = "-";
    homeElem.totalExpenses.innerHTML = "-";
    homeElem.totalIncome.innerHTML = "-";
  };

  const getRubroNameById = (rubroId) => {
    const rubrosList = JSON.parse(getFromLocalStorage(LS_STRING_RUBROS_LIST));
    // console.log("rubrosList", rubrosList);
    for (let rubro of rubrosList) {
      if (rubro.id == rubroId) return rubro.nombre;
    }
  };

  // crea elementos y calcula datos para mostrar en elementos
  const renderMovementsData = (movementsParam) => {
    try {
      if (!isUserLogged()) {
        throw new Error("Antes debes loggearte!");
      }
      //miniFuncion para crear y devolver list item con datos
      const renderListItem = (data) => {
        return `<ion-item lines="full">
        
        <ion-label style="flex: 2">
          <h2>${data.concepto}</h2>
          <p>
            <ion-icon slot="start" name="${
              isGasto(data) ? "caret-down" : "caret-up"
            }" color="${isGasto(data) ? "danger" : "success"}"></ion-icon> 
            <i>${getRubroNameById(data.categoria)}</i>
          </p>

          <ion-chip>
            <ion-icon name="logo-usd"></ion-icon>
            <ion-label><b>${data.total}</b></ion-label> 
          </ion-chip><i>${data.medio}</i>
        </ion-label>
        <ion-label>
          <p>${data.fecha}</p>
        </ion-label>
        <ion-button color="danger" data-id=${data.id}>
          <ion-icon slot="icon-only" name="trash"></ion-icon>
        </ion-button></ion-item>`;
      };

      //miniFuncion para crear y devolver nota en caso de que no haya datos
      const noDataNote = (movementType) => {
        if (movementType === "allMovements") {
          return `<ion-item><ion-note style="width: 100%"><h2 style="text-align: center; font-style: italic;">No hay ningún movimiento registrado<h2></ion-note></ion-item>`;
        } else if (movementType === "expensesMovements") {
          return `<ion-item><ion-note style="width: 100%"><h2 style="text-align: center; font-style: italic;">No hay ningún gasto registrado<h2></ion-note></ion-item>`;
        } else if (movementType === "incomeMovements") {
          return `<ion-item><ion-note style="width: 100%"><h2 style="text-align: center; font-style: italic;">No hay ningún ingreso registrado<h2></ion-note></ion-item>`;
        } else {
          return `<ion-item><ion-note style="width: 100%"><h2 style="text-align: center; font-style: italic;">No hay ningún movimiento<h2></ion-note></ion-item>`;
        }
      };

      let total = {
        expenses: 0,
        available: 0,
        income: 0,
      };

      console.log("renderizando movimientos");
      resetMovementsData();
      let hayGastos = false;
      let hayIngresos = false;
      if (movementsParam.length > 0) {
        for (const movimiento of movementsParam) {
          homeElem.listAllMovements.innerHTML += renderListItem(movimiento);
          // console.log("element",homeElem.listAllMovements.querySelector(`ion-button[data-id="${movimiento.id}"]`))
          // console.log("movimiento.id", movimiento.id)
          // homeElem.listAllMovements
          //   .querySelector(`ion-button[data-id="${movimiento.id}"]`)
          //   .addEventListener("click", (ev) => {
          //     console.log("BOTON!")
          //     deleteMovementHandler(ev);
          // });
          if (isGasto(movimiento)) {
            hayGastos = true;
            homeElem.listExpensesMovements.innerHTML +=
              renderListItem(movimiento);
            // homeElem.listExpensesMovements
            //   .querySelector(`ion-button[data-id="${movimiento.id}"]`)
            //   .addEventListener("click", (ev) => {
            //     deleteMovementHandler(ev);
            //   });
            total.expenses += movimiento.total;
            total.available -= movimiento.total;
          } else {
            hayIngresos = true;
            homeElem.listIncomeMovements.innerHTML +=
              renderListItem(movimiento);
            // homeElem.listIncomeMovements
            //   .querySelector(`ion-button[data-id="${movimiento.id}"]`)
            //   .addEventListener("click", (ev) => {
            //     deleteMovementHandler(ev);
            //   });
            total.income += movimiento.total;
            total.available += movimiento.total;
          }
        }
        homeElem.totalAvailable.innerHTML = `$${total.available}`;
        homeElem.totalExpenses.innerHTML = `$${total.expenses}`;
        homeElem.totalIncome.innerHTML = `$${total.income}`;

        // Establece función de eliminar para cada botón de cada lista
        for (const movementBtn of homeElem.listAllMovements.querySelectorAll(
          "ion-item ion-button"
        )) {
          movementBtn.addEventListener("click", (ev) => {
            deleteMovementHandler(ev);
          });
        }
        for (const movementBtn of homeElem.listExpensesMovements.querySelectorAll(
          "ion-item ion-button"
        )) {
          movementBtn.addEventListener("click", (ev) => {
            deleteMovementHandler(ev);
          });
        }
        for (const movementBtn of homeElem.listIncomeMovements.querySelectorAll(
          "ion-item ion-button"
        )) {
          movementBtn.addEventListener("click", (ev) => {
            deleteMovementHandler(ev);
          });
        }
      } else {
        homeElem.listAllMovements.innerHTML += noDataNote("allMovements");
        homeElem.listExpensesMovements.innerHTML +=
          noDataNote("expensesMovements");
        homeElem.listIncomeMovements.innerHTML += noDataNote("incomeMovements");
        homeElem.totalAvailable.innerHTML += "-";
        homeElem.totalExpenses.innerHTML += "-";
        homeElem.totalIncome.innerHTML += "-";
      }
      if (!hayGastos) {
        homeElem.listExpensesMovements.innerHTML +=
          noDataNote("expensesMovements");
      }
      if (!hayIngresos) {
        homeElem.listIncomeMovements.innerHTML += noDataNote("incomeMovements");
      }
    } catch (errorParam) {
      console.log(errorParam);
      redirectLoginError(errorParam);
    }
  };

  // switchea entre las listas
  const switchListTo = (listElem) => {
    console.log("cambiando a:", listElem);
    homeElem.listAllMovements.style.display = "none";
    homeElem.listIncomeMovements.style.display = "none";
    homeElem.listExpensesMovements.style.display = "none";
    listElem.style.display = "";
  };

  const getMovements = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("apikey", getUserToken());

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${env.apiURL}/movimientos.php?idUsuario=${getFromLocalStorage(
        LS_STRING_USER_ID
      )}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.codigo == 200) {
          setTimeout(() => {
            renderMovementsData(result.movimientos);
            // renderMovementsData(userMovements);
            hideAllLoadingScreens();
          }, 500);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const deleteMovementRequest = (movementElem) => {
    let reqHeader = new Headers();
    reqHeader.append("Content-Type", "application/json");
    reqHeader.append("apikey", getUserToken());

    let rawData = JSON.stringify({
      idMovimiento: Number(movementElem.getAttribute("data-id")),
    });

    var reqOptions = {
      method: "DELETE",
      headers: reqHeader,
      body: rawData,
      redirect: "follow",
    };
    movementElem.innerHTML =
      '<ion-spinner name="lines-sharp-small"></ion-spinner>';
    fetch(`${env.apiURL}/movimientos.php`, reqOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.codigo === 200) {
          // throw new Error("Error al eliminar el movimiento");
          setTimeout(() => {
            presentToast(`${result.mensaje}`, "top", "success");
            setTimeout(() => {
              // showLoadingScreen(loadingElems.homeLoading);
              getMovements();
            }, 300);
          }, 800);
        } else {
          movementElem.innerHTML =
            '<ion-icon slot="icon-only" name="trash"></ion-icon>';
          throw new Error(result.mensaje);
        }
      })
      .catch((errorParam) => {
        console.log("error", errorParam);
        presentToast(`${errorParam}`, "top", "danger");
      });
  };

  const deleteMovementHandler = (ev) => {
    let movementElem = ev.target;
    // console.log("movement", movementBtn);
    // console.log("movementId", movementBtn.getAttribute("data-id"));
    deleteMovementRequest(movementElem);
  };

  // MAP
  const resetMap = () => {
    if (map) {
      map.eachLayer(function (layer) {
        map.removeLayer(layer);
      });
      map.remove();
      map = undefined;
    }
    // map = null
  };
  const renderMap = () => {
    console.log("no hay mapa, renderizando uno nuevo");
    map = L.map("map", {
      center: [-32.741082231501245, -55.98632812500001],
      zoom: 3,
    });
    const mapLayer = L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
      }
    );
    mapLayer.addTo(map);
  };
  const setMapUbication = (lat, long, zoom) => {
    map.flyTo([lat, long], zoom);
  };
  const getMyUbication = async () => {
    let myMarker = L.icon({
      iconUrl: "./myLocation.png",
      iconSize: [33, 50],
      iconAnchor: [17, 50],
      popupAnchor:	[0, -38.5]
  
    });
    const successCallback = (position) => {
      console.log("position", position);
      setMapUbication(position.coords.latitude, position.coords.longitude, 15);

      L.marker([position.coords.latitude, position.coords.longitude], {
          icon: myMarker,
      }).addTo(map);
      saveInLocalStorage(
        LS_STRING_UBICATION,
        JSON.stringify({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      );
      getCajerosApi();
    };
    const errorCallback = (error) => {
      console.log(error);
      presentToast(`No se ha podido acceder a su ubicación.`, "top", "danger");
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  };
  const initializeMap = () => {
    showLoadingScreen(loadingElems.mapLoading);
    setTimeout(function () {
      renderMap();
      setTimeout(() => {
        setMapUbication(-32.741082231501245, -55.98632812500001, 8);
        hideAllLoadingScreens();
        getMyUbication();
      }, 1000);
    }, 2000);
  };

  // const calcDistance = (punto1, punto2)=>{
  //   return Math.sqrt((Math.pow((punto2.lat - punto1.lat, 2) + (Math.pow((punto2.lon - punto1.lon, 2))
  // }
  const calcularDistanciaEntrePuntos = (puntoInicial, puntoFinal) => {
    // Dividimos entre 1000 para pasar de m a km.
    let distancia = Number(
      map.distance(puntoInicial, puntoFinal) / 1000
    ).toFixed(2);
    return distancia;
  };

  const ordenarCajeros = (cajeros) => {
    let result = [...cajeros];
    let ubicacionUsuario = JSON.parse(getFromLocalStorage(LS_STRING_UBICATION));
    for (const cajero of result) {
      cajero.distancia = calcularDistanciaEntrePuntos(
        [ubicacionUsuario.lat, ubicacionUsuario.lon],
        [cajero.latitud, cajero.longitud]
      );
    }
    result.sort((a, b) => a.distancia - b.distancia);
    return result;
  };

  //funcion para traer cajeros y cargar marcadores en el mapa
  const getCajerosApi = () => {
    // let cajeros;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    try {
      fetch(`${env.apiURL}/cajeros.php`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result.cajeros);
          const cajerosOrdenados = ordenarCajeros(result.cajeros);
          for (let i = 0; i < 5; i++) {
            let cajero = cajerosOrdenados[i];
            // LLAMO PARA DIBUJAR
            setCajeroInMap(cajero);
          }
        })
        .catch((error) => console.log("error", error));

      // for (const cajero of cajeros) {
      //   L.marker([cajero.latitud, cajero.longitud])
      //   .addTo(map)
      //   .bindPopup(
      //     `Disponibilidad Dinero: ${(cajero.disponible)?("Si"):("No")}, Recibe depositos: ${(cajero.depositos)?("Si"):("No")}`
      //   );

      // }
    } catch (error) {
      console.log(error);
    }
  };
  //seteo cajeros
  const setCajeroInMap = (cajero) => {
    try {
      // if (!isUserLogged) {
      //   const msg = "Debes Loggearte!";
      //   presentToast(`${msg}`, "top", "warning");
      // }
      L.marker([cajero.latitud, cajero.longitud])
        .addTo(map)
        .bindPopup(
          `Disponibilidad Dinero: ${
            cajero.disponible ? "Si" : "No"
          }, Recibe depositos: ${cajero.depositos ? "Si" : "No"}`
        );
      // setMarkersMap();
    } catch (error) {
      console.log(error);
      presentToast(`${error}`, "top", "danger");
    }
  };

  // 1ro Petición y traigo todos los cajeros
  // 2ndo guardo los cajeros
  // 3ro filtro los cajeros segun distancia (más ceranos)
  // 4to dibujo los 5 cajeros más cercanos

  const shareHandler = () =>{
    shareApp();
    shareNavegador();
    presentToast("Compartir!", "top", "success");
  }
  const shareApp = async () => {
    console.log("Implementar share func");
    // implementar
    try {
   
      if(Capacitor.isNativePlatform()){
        await Capacitor.Plugins.Share.share({
          title: 'FinanzAPP',
          text: 'Check out this APP!',
          url: 'https://dwallet.develotion.com/site/',
          dialogTitle: 'Share with buddies',
        });
      }
    } catch (e) {
      console.log("No se puede compartir en Navegador de esta manera!");
    }



  };

  const shareNavegador = () =>{
    
      navigator.share({
        title: 'FinanzAPP',
        text: 'Check out this APP!',
        url: 'https://dwallet.develotion.com/site/'
      });
    
  }
  //--------- INICIALIZACION DE LA APP ---------//
  clearAppData();
  menuOptionsToDisplay([menuOptions.login, menuOptions.registration]);
  //Router
  document
    .querySelector("#router")
    .addEventListener("ionRouteDidChange", navegation);

  menuOptions.logout.addEventListener("click", () => {
    logoutFunc();
  });

  // Set close behavior when click a menu opt
  for (const elem in menuOptions) {
    if (Object.hasOwnProperty.call(menuOptions, elem)) {
      const element = menuOptions[elem];
      element.addEventListener("click", () => {
        menu.close();
      });
    }
  }

  ingresoElems.cancelBtn.addEventListener("click", () => {
    resetInputsMovimientos();
    closeModal(modals.modalIngreso);
  });
  gastoElems.cancelBtn.addEventListener("click", () => {
    resetInputsMovimientos();
    closeModal(modals.modalGasto);
  });
  loginElem.submitBtn.addEventListener("click", () => {
    loginFunc();
  });
  registrationElem.submitBtn.addEventListener("click", () => {
    registerFunc();
  });
  gastoElems.registrarGastoBtn.addEventListener("click", () => {
    addGastoFunc();
  });
  ingresoElems.registrarIngresoBtn.addEventListener("click", () => {
    addIngresoFunc();
  });
  registrationElem.inputDpto.addEventListener("ionChange", (e) => {
    console.log(e.target.value);
    registrationElem.inputCity.value = "";
    loadCitiesForDep(e.target.value);
    registrationElem.inputCity.setAttribute("disabled", "false");
  });
  homeElem.segmentAll.addEventListener("click", () => {
    switchListTo(homeElem.listAllMovements);
  });
  homeElem.segmentExpenses.addEventListener("click", () => {
    switchListTo(homeElem.listExpensesMovements);
  });
  homeElem.segmentIncome.addEventListener("click", () => {
    switchListTo(homeElem.listIncomeMovements);
  });
  // homeElem.newMovementBtn.addEventListener("click", e =>{
  //   console.log(e.target);
  //   selectNewMovement();
  // })
  shareBtn.addEventListener("click", ()=>{
    shareHandler()
  })
});

// Manejo de formato fecha para API
//`${miFecha.getFullYear()}-${(miFecha.getMonth()+1 < 10)?("0"+(miFecha.getMonth()+1)):(miFecha.getMonth()+1)}-${(miFecha.getDate() < 10)?("0"+(miFecha.getDate())):(miFecha.getDate())}`
