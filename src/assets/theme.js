import { StyleSheet, Dimensions } from 'react-native'

export const ThemeBase = StyleSheet.create({
    bottomLine: {
        borderBottomWidth:1,
        borderBottomColor: '#dadada',
        width: Dimensions.get('window').width
    },
    flatList: {
        width: Dimensions.get('window').width,
        flex:1
    }
})

export const Menu = StyleSheet.create({
    numbers: {
        fontSize: 34,
        color: '#fad390',
        fontWeight:'bold'
    }
})

export const NonCommercial = StyleSheet.create({
    formViewArea: {
        backgroundColor: '#60a3bc',
        borderBottomWidth: 1, 
        borderBottomColor: '#dadada',
    },
    pickedButton: {
        flex:1,
        justifyContent:'center', alignItems:'center',
        height:50
    },
    pickedButtonSelected: {
        backgroundColor: '#60a3bc',
    },
    pickedButtonNormal: {
        borderWidth:1,
        borderColor: '#60a3bc'
    },
    pickedButtonSelectedText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    fullBlock: {
        paddingTop:20,
        paddingBottom: 20,
        backgroundColor: '#0a3d62',
        alignItems: 'center',
        width:Dimensions.get('window').width
    }
})

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    width100: {
        width: Dimensions.get('window').width
    },
    infoLabel: {
        fontSize:14,
        fontStyle:'italic',
        textAlign:'center',
        paddingBottom: 10
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
        backgroundColor: '#e58e26',
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
        textAlign:'center',
        fontSize: 16
    },
    pickedButton: {
        flex:1,
        justifyContent:'center', alignItems:'center',
        height:50
    },
    pickedButtonLabel: {
        fontSize:26,
    },
    pickedButtonSelected: {
        backgroundColor: '#fa983a',
    },
    pickedButtonNormal: {
        borderWidth:1,
        borderColor: '#fa983a'
    },
    pickedButtonSelectedText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    inputLabel: {
        fontSize:18,
        marginBottom: 4,
        marginTop: 10
    },
    textInput: {
        borderBottomColor: '#666',
        borderBottomWidth: 1,
        marginTop:-10,
        fontSize:24
    },
    tariffContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e55039'
    },
    domesticContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1e3799'
    },
    nonDomesticContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#60a3bc'      
    }
})