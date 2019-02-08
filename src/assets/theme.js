import { StyleSheet, Dimensions } from 'react-native'

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    width100: {
        width: Dimensions.get('window').width
    },
    profileHeader: {
        height: 280,
        backgroundColor: 'lightblue'
    },
    homeMainMenu: {
        alignItems: 'center'
    },
    homeNumber: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30
    },
    menuContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        alignContent: 'space-between',
    },
    flatList: {
        flex: 1
    },
    flatListView: {
        paddingTop: 5,
        paddingBottom: 5
    },
    formView: {
        paddingTop: 10,
        paddingLeft:10,
        paddingRight:10
    },
    formViewLabel: {
        color:'#fff', 
        fontWeight: 'bold',
        fontSize:16
    },
    formViewArea: {
        borderBottomWidth: 1, 
        borderBottomColor: '#dadada',
        backgroundColor: '#e58e26'
    },
    formVacantText: {
        color:'#fff', 
        fontSize:16
    },
    button: {
        paddingTop:20
    },
    livid: {
        backgroundColor:'#6a89cc',
        justifyContent:'space-around'
    },
    bottomZero: {
        bottom:20
    },
    fullBlock: {
        paddingTop:20,
        paddingBottom: 20,
        backgroundColor: '#1e3799',
        alignItems: 'center',
        width:Dimensions.get('window').width
    },
    fullBlockDanger: {
        paddingTop:20,
        paddingBottom: 20,
        backgroundColor: '#eb2f06',
        alignItems: 'center',
        width:Dimensions.get('window').width
    },
    fullBlockText: {
      color: '#fff',
      fontSize: 16,
      fontWeight:'bold'
    },
    homeTaskText: {
        fontSize: 16
    }


})