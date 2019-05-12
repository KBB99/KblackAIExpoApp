import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Platform, Alert, Modal, FlatList, ActivityIndicator } from 'react-native';
import { Camera, Permissions, ImagePicker, Linking } from 'expo';

export default class HomeScreen extends React.Component {

  static navigationOptions = ({navigation}) => ({
    title: 'Kblack AI',
  })

  state = {
    image: '',
    result: '',
    modalVisible: false,
    aboutVisible:false,
    loading: false
  }

  async _pickImage() {
    if (Platform.OS === 'ios'){
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status === 'granted'){
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });

        if (!result.cancelled) {
          this.setState({ image: result });
        }
      }
      else {
        Alert.alert("Permission Denied","Please go to settings and allow Kblack AI to access your gallery")
      }
    }
    else {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0
      });
      if (!result.cancelled) {
        this.setState({ image: result });
      }
    }
  }

  async getPredictions() {
    this.setState({loading:true})
    await this._pickImage()
    if (this.state.image == ''){
      this.setState({loading:false})
      return
    }
    var xhr = new XMLHttpRequest();
    const url = 'https://kblackaibackend.onrender.com/analyze'
    var photo = {
      uri: (Platform.OS==='android'?'file://:':'')+this.state.image.uri,
      type: 'image/jpeg',
      name: 'photo.jpg'
    }
    xhr.open('POST',url,true);
    console.log('OPENED',xhr.status);
    xhr.onerror = function (){
      console.log(xhr.responseText)
    }
    xhr.onload = function (e) {
        console.log('DONE', xhr.status);
        const result = JSON.parse(e.target.responseText)
        this.setState(this.setState({result:result, modalVisible: true,loading:false}))
        console.log(this.state.result)
    }.bind(this);
    const formData = new FormData();
    formData.append("file",photo);
    xhr.send(formData)
  }

  renderResult(){
    if (this.state.result != ''){
      return (
        <TouchableOpacity style={styles.toggleResult} onPress={() => this.setState({modalVisible:true})}>
          <Text style={styles.boxText}>
            Result
          </Text>
        </TouchableOpacity>
      )
    }
    else {
      return
    }
  }

  renderTest(){
    if (this.state.loading){
      return(
        <TouchableOpacity style={styles.testBox} onPress={() => {}}>
          <ActivityIndicator style={{...styles.boxText,color:"#B7AE7E"}} />
        </TouchableOpacity>
      )
    }
    else {
      return (
        <TouchableOpacity style={styles.testBox} onPress={() => this.getPredictions()}>
          <Text style={{...styles.boxText,color:"#B7AE7E"}}>
            Test
          </Text>
        </TouchableOpacity>
      )
    }
  }

  linkTo(name){
    if (name == "Melanocytic Nevi"){
      Linking.openURL("https://en.wikipedia.org/wiki/Melanocytic_nevus")
    }
    else if (name == "Melanoma"){
      Linking.openURL("https://en.wikipedia.org/wiki/Melanoma")
    }
    else if (name == "Benign Keratosis"){
      Linking.openURL("https://en.wikipedia.org/wiki/Seborrheic_keratosis")
    }
    else if (name == "Basal Cell Carcinoma"){
      Linking.openURL("https://en.wikipedia.org/wiki/Basal-cell_carcinoma")
    }
    else if (name == "Actinic Keratoses"){
      Linking.openURL("https://en.wikipedia.org/wiki/Actinic_keratosis")
    }
    else if (name == "Vascular Lesions"){
      Linking.openURL("https://en.wikipedia.org/wiki/Vascular_anomaly")
    }
    else if (name == "Dermatofibroma"){
      Linking.openURL("https://en.wikipedia.org/wiki/Dermatofibroma")
    }
    else if (name == "About"){
      this.setState({aboutVisible:true})
    }
  }

  render() {
      return (
        <View style={{ flex: 1}}>
          <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
          >
            <TouchableOpacity style={{flex:1,justifyContent: 'space-around'}} onPress={()=>this.setState({modalVisible:false})} activeOpacity={1}>
              <View style={styles.resultBox}>
                <FlatList
                  data={
                    this.state.result.result
                  }
                  keyExtractor={(item, index)=>index.toString()}
                  renderItem={ ({item}) =>(
                    <View style={{height:100,flexDirection:"row",alignItems: "center"}}>
                      <View style={{flexDirection:"column",width:200}}>
                        <Text style={{alignSelf:"center",color:"white",fontWeight:"500",fontSize:20}}>{item.name}</Text>
                      </View>
                      <View style={{flexDirection:"column",width:100}}>
                        <View style={{alignItems:"center",justifyContent:"space-around",backgroundColor:"#374785",borderRadius:38,height:76,width:76}}>
                          <Text style={{color:"white",fontWeight:"700"}}> {item.probability}% </Text>
                        </View>
                      </View>
                    </View>
                  )
                  }
                />
              </View>
            </TouchableOpacity>
          </Modal>
          <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.aboutVisible}
          onRequestClose={() => {}}
          >
            <TouchableOpacity style={{flex:1,justifyContent: 'space-around'}} onPress={()=>this.setState({aboutVisible:false})} activeOpacity={1}>
              <View style={styles.resultBox}>
                <Text style={{color:"white",fontSize:18,alignSelf:"center",marginTop:20,fontWeight:"600"}}>
                  About
                </Text>
                <Text style={{color:"white",margin:15}}>
                  Kblack AI leverages the latest technologies in order to improve human well-being.
                  This particular application uses a trained deep learning model in or-der to find patterns in dermatoscopic im-ages.
                  As time progresses we shall add m-ore and more features in order to compl-ement healthcare professionals and ease the burden on healthcare systems around the world.
                  If interested in getting in touch, please send a message to:
                </Text>
                <TouchableOpacity >
                  <Text style={{color:"white",alignSelf:"center"}}onPress={()=>Linking.openURL("mailto://contact@kblack.ai")}>
                    contact@kblack.ai.
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
          {this.renderResult()}
          {this.renderTest()}
          <Text style={{alignSelf:"center",marginTop:20,fontSize:20,fontWeight:"700"}}>Categories</Text>
          <FlatList
            data={[
              {name1:"Melanocytic Nevi",color1:"#A8D0E6",name2:"Melanoma",color2:"#374785"},
              {name1:"Benign Keratosis",color1: "#24305E",name2:"Basal Cell Carcinoma",color2:"#F76C6C"},
              {name1:"Actinic Keratoses",color1:"#A8D0E6", name2:"Vascular Lesions", color2:"#374785"},
              {name1:"Dermatofibroma",color1: "#24305E",name2:"About",color2:"#F76C6C",paddingBottom:60},
            ]}
            keyExtractor={(item,index)=>index.toString()}
            renderItem={ ({item}) =>(
                <View style={{flexDirection:"row",justifyContent:"space-around",marginTop:20,paddingBottom:item.paddingBottom}}>
                  <TouchableOpacity style={{...styles.descriptionBox, backgroundColor:"#374785"}} onPress={()=>this.linkTo(item.name1)}>
                    <Text style={styles.descriptionText}>{item.name1}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{...styles.descriptionBox, backgroundColor:"#374785"}} onPress={()=>this.linkTo(item.name2)}>
                    <Text style={styles.descriptionText}>{item.name2}</Text>
                  </TouchableOpacity>
                </View>
            )
            }
            />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  testBox: {
    backgroundColor: "#F8E9A1",
    alignSelf: "center",
    justifyContent: "space-around",
    marginTop: 20,
    height: 80,
    width: 150,
    borderRadius: 20
  },
  boxText: {
    alignSelf: "center",
    fontWeight: "700",
    fontSize: 18,
    color: "white"
  },
  resultBox: {
    height: 300,
    width: 300,
    borderRadius: 5,
    alignSelf: "center",
    backgroundColor: "#24305E"
  },
  toggleResult:{
    width:150,
    height:50,
    borderRadius: 20,
    marginTop: 20,
    backgroundColor: "#F76C6C",
    alignSelf: "center",
    justifyContent: "space-around",
  },
  descriptionText:{
    alignSelf: "center",
    color: "#6C75A2",
    fontWeight:"900",
    fontSize:14
  },
  descriptionBox:{
    height:120,
    width:160,
    borderRadius: 20,
    justifyContent:"space-around"
  }
})
