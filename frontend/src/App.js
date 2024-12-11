
import './App.css';
import UserDashboard from './components/userDashboard';


function App({sidebarToggle}) {
  
  // let components
  //   switch(window.location.pathname){
  //     case '/':
  //       components = <UserDashboard/>
  //       break;
  //     case '/recency':
  //       components = <Recency/>
  //       break;
  //     case '/frequency':
  //       components = <Frequency/>
  //       break;
  //     case '/monetary':
  //       components = <Monetary/>
  //       break;
  //   }



  return (
    <>
      <UserDashboard/>
      {/* {components} */}
    </>
  );
}

export default App;
