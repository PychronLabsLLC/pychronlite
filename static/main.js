
// do initialiation
$(document).ready(function (){
    initialization()
})

function doCalculations(){
    let url = '/doCalculations'
    let dt = $('#analysestable').DataTable();

    fetch(url,{method: 'POST',
            headers: {'Accept': 'application/json, text/plain, */*',
                       'Content-Type': 'application/json'},
            body: JSON.stringify(dt.rows().data())}
        ).then(response=> response.json()).then(data=>{
        console.log('docalculations response', data)

        let rdt = $('#resultstable').DataTable()
        rdt.clear().draw()
        rdt.rows.add(data['results']).draw()

        let mdt = $('#meanstable').DataTable()
        mdt.rows.add(data['means']).draw()
    })

}

function initialization(){
    const dataset = [{runid: '1000-01',
    sample: 'bar',
    project: 'moo',
        ar40: 10,
        ar39: 10,
        ar38: 0.0001,
        ar37: 0.0001,
        ar36: 0.0003,
        ar40err: 0.00001,
        ar39err: 0.00001,
        ar38err: 0.00001,
        ar37err: 0.00001,
        ar36err: 0.00001,
        j: 0.02,
        jerr: 0.0002
    },
        {runid: '1000-02',
        sample: 'bar',
        project: 'moo',
        ar40: 10,
        ar39: 9.9,
        ar38: 0.0001,
        ar37: 0.0001,
        ar36: 0.0004,
        ar40err: 0.00001,
        ar39err: 0.00001,
        ar38err: 0.00001,
        ar37err: 0.00001,
        ar36err: 0.00001,
        j: 0.02,
        jerr: 0.0002
    },
         {runid: '1001-02',
        sample: 'foo',
        project: 'moo',
        ar40: 10,
        ar39: 9.5,
        ar38: 0.0001,
        ar37: 0.0001,
        ar36: 0.0004,
        ar40err: 0.00001,
        ar39err: 0.00001,
        ar38err: 0.00001,
        ar37err: 0.00001,
        ar36err: 0.00001,
        j: 0.02,
        jerr: 0.0002
    },
         {runid: '1001-02',
        sample: 'foo',
        project: 'moo',
        ar40: 10,
        ar39: 9.8,
        ar38: 0.0001,
        ar37: 0.0001,
        ar36: 0.0004,
        ar40err: 0.00001,
        ar39err: 0.00001,
        ar38err: 0.00001,
        ar37err: 0.00001,
        ar36err: 0.00001,
        j: 0.02,
        jerr: 0.0002
    }
    ]

    $('#analysestable').DataTable({
                data: dataset,
                columns: [{data: 'runid',
                            label: 'RunID'},
                            {data: 'sample'},
                            {data: 'project'},
                            {data: 'j'},
                            {data: 'jerr'},
                            {data: 'ar40'},
                            {data: 'ar40err'},
                            {data: 'ar39'},
                            {data: 'ar39err'},
                            {data: 'ar38'},
                            {data: 'ar38err'},
                            {data: 'ar37'},
                            {data: 'ar37err'},
                            {data: 'ar36'},
                            {data: 'ar36err'},
                            ]
                });

    $('#resultstable').DataTable({
                columns: [{data: 'sample'},
                            {data: 'age'},
                            {data: 'ageerr'},
                            {data: 'ageerr_percent'},
                            {data: 'radiogenic_yield'},
                            ]
                });

    $('#meanstable').DataTable({
                columns: [{data: 'sample'},
                            {data: 'mean'},
                            {data: 'mean_err'},
                            {data: 'mean_err_percent'},

                            ]
                });


}
