function LoginPage(){
    return(
        <div>
 
          <form>
            <div>
                <label>Email</label>
                <br/>
                <input type="email"
                placeholder="Enter your email"/>
            </div>
            <br/>
             <div>
                <label>Password</label>
                <br/>
                <input type="Passwordd"
                placeholder="Enter your Passwordd"/>
            </div>
            <br/>
            <button type= "submit">
                login
            </button>
          </form>
          <h1> Taskflow Saas</h1>
        </div>
    )
}

export default LoginPage;