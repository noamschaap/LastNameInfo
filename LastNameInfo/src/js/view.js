
var SearchBar = React.createClass({

	getInitialState() {
		return { value: '' };
	},
	handleChange(event) {
		this.setState({value: event.target.value});
	},

	handleSubmit(event){
		event.preventDefault();
		//$( "#namesearch" ).hide();
		//$( "#researchbutton" ).show();
		this.props.onUserInput(
      		false
    	);
		var search_name = this.state.value;
		setSearchStatus(false, search_name)
		addSpinner();
		loadAllData(search_name);
	},

    render: function() {
        return (
            <form onSubmit={this.handleSubmit} className={this.props.searchInputShowing ? 'displayON' : 'displayOFF'} >
                <input 
                	type="text" 
                	placeholder="Enter a last name" 
                	id="namesearch"
                	value={this.state.value}
                	onChange={this.handleChange} />
            </form>
        );
    }
});

var ResearchButton = React.createClass({

	getInitialState() {
		return { value: '' };
	},
	

	handleOnClick(event){
		this.props.onUserInput(
      		true
    	);
		setSearchStatus(true, "")
		$( "#charts" ).empty();
		//$( "#researchbutton" ).hide();
		//$( "#namesearch" ).show();
	},
	

    render: function() {
        return (
            <button 
            	className={this.props.searchInputShowing ? 'displayOFF' : 'displayON'}
            	onClick={this.handleOnClick}
                id="researchbutton" >
                New Search
            </button>
        );
    }
});

var SearchSetup = React.createClass({
	getInitialState: function() {
	    return {
	      searchInputShowing: true
	    };
  	},
  	
  	handleUserInput: function(search_input_showing) {
    	this.setState({
     		searchInputShowing: search_input_showing
   		});
  	},
  	
  	render: function() {
    	return (
	    	<div>
		        <SearchBar 
		        	searchInputShowing={this.state.searchInputShowing} 
		        	onUserInput={this.handleUserInput} />
		        <ResearchButton 
		        	searchInputShowing={this.state.searchInputShowing}
		        	onUserInput={this.handleUserInput} />
		    </div>
    	);
  	}
});


ReactDOM.render(
  <SearchSetup />,
  document.getElementById('container')
);